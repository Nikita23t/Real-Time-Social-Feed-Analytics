<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## микросервис 2


### 📁 Микросервис 2: Event Processor  
_Обработчик событий из Kafka, агрегация данных, работа с Redis и PostgreSQL, генерация алертов._

---

### **Структура проекта**
```
event-processor/
├── src/
│   ├── modules/
│   │   ├── kafka/                  # Логика работы с Kafka
│   │   │   ├── kafka.consumer.ts   # Consumer для топика "user-actions"
│   │   │   └── kafka.producer.ts   # Producer для топика "notifications" (алерты)
│   │   │
│   │   ├── analytics/              # Аналитика и агрегация данных
│   │   │   ├── analytics.service.ts
│   │   │   └── entities/           # Сущности PostgreSQL (например, EventEntity)
│   │   │
│   │   └── alerts/                 # Детектор аномалий
│   │       ├── alerts.service.ts
│   │       └── dto/                # DTO для алертов
│   │
│   ├── common/
│   │   ├── database/               # Конфиг TypeORM (PostgreSQL)
│   │   └── redis/                  # Redis client
│   │
│   ├── config/                     # Конфигурация
│   │   ├── kafka.config.ts
│   │   ├── database.config.ts
│   │   └── app.config.ts
│   │
│   ├── app.module.ts               # Корневой модуль
│   └── main.ts                     # Точка входа
│
├── test/
├── docker/
├── .env
├── package.json
└── README.md
```

---

### 📦 Зависимости (установить через `npm install`)
```bash
# Основные
@nestjs/core @nestjs/common 
@nestjs/microservices 
@nestjs/typeorm typeorm pg 

# Kafka
kafkajs 

# Redis
ioredis 

# Дополнительные
dotenv @nestjs/config 
```

---

### 🧩 Основные компоненты

#### 1. **Kafka Consumer (обработка событий)**
- Чтение из топика `user-actions`.
- Сохранение данных в PostgreSQL.
- Обновление счетчиков в Redis.

**Пример кода:**
```typescript
// kafka.consumer.ts
@Injectable()
export class KafkaConsumerService {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly alertsService: AlertsService,
  ) {}

  @KafkaListener('user-actions')
  async handleUserActions(@Payload() message: KafkaMessage) {
    const event = JSON.parse(message.value.toString()) as UserActionEvent;

    // Сохранение в PostgreSQL
    await this.analyticsService.saveEventToDB(event);

    // Обновление счетчиков в Redis
    await this.analyticsService.updateRedisCounters(event);

    // Проверка на аномалии (например, слишком много лайков за минуту)
    if (await this.alertsService.checkForFraud(event)) {
      await this.alertsService.sendAlert(event);
    }
  }
}
```

---

#### 2. **Работа с PostgreSQL (TypeORM)**
- Сущность `Event`:
  ```typescript
  // entities/event.entity.ts
  @Entity()
  export class EventEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    type: string; // 'like', 'comment', 'post'

    @Column()
    userId: string;

    @Column()
    postId: string;

    @CreateDateColumn()
    timestamp: Date;
  }
  ```
- Агрегация данных (например, через SQL-запросы):
  ```typescript
  // analytics.service.ts
  async getDailyStats() {
    return this.eventRepository
      .createQueryBuilder('event')
      .select('DATE(event.timestamp)', 'date')
      .addSelect('COUNT(*)', 'count')
      .groupBy('date')
      .getRawMany();
  }
  ```

---

#### 3. **Работа с Redis**
- Обновление счетчиков:
  ```typescript
  // analytics.service.ts
  async updateRedisCounters(event: UserActionEvent) {
    const redisKey = `post:${event.postId}:likes`;
    await this.redisClient.incr(redisKey);

    // Добавление в сортированный набор для топа постов
    await this.redisClient.zincrby('top_posts', 1, event.postId);
  }
  ```

---

#### 4. **Alert Engine**
- Проверка условий для алертов (например, подозрительная активность):
  ```typescript
  // alerts.service.ts
  async checkForFraud(event: UserActionEvent): Promise<boolean> {
    const likesCount = await this.redisClient.get(`post:${event.postId}:likes`);
    return parseInt(likesCount) > 100; // Пример триггера
  }

  async sendAlert(event: UserActionEvent) {
    const alert = { 
      type: 'FRAUD_ALERT', 
      message: `Подозрительная активность на посте ${event.postId}` 
    };
    await this.kafkaProducer.send({
      topic: 'notifications',
      messages: [{ value: JSON.stringify(alert) }],
    });
  }
  ```

---

### ⚙️ Конфигурация

Файл `.env`:
```env
# PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=analytics

# Kafka
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=event-processor

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

Конфиг TypeORM (`config/database.config.ts`):
```typescript
export default TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [EventEntity],
  synchronize: true, // Отключить в production!
});
```

---

### ▶️ Запуск
1. Установить зависимости:
   ```bash
   npm install
   ```

2. Запустить микросервис:
   ```bash
   npm run start:dev
   ```

3. Проверить работу:
   - Отправьте событие через API Gateway (`POST /api/events`).
   - Убедитесь, что событие появилось в PostgreSQL:
     ```sql
     SELECT * FROM event_entity;
     ```
   - Проверьте счетчики в Redis:
     ```bash
     redis-cli GET post:123:likes
     ```

---

### 📊 Интеграция с Grafana
1. **PostgreSQL Data Source**:
   - Дашборд "История событий":
     ```sql
     SELECT type, COUNT(*) FROM event_entity GROUP BY type;
     ```

2. **Redis Data Source**:
   - Топ постов:
     ```sql
     ZREVRANGE top_posts 0 9 WITHSCORES
     ```

---

### 🔍 Что проверить
- События из Kafka сохраняются в PostgreSQL.
- Счетчики в Redis обновляются при каждом событии.
- При превышении лимита (например, 100 лайков) алерт отправляется в топик `notifications`.

---

### 🚀 Возможные улучшения
1. **Добавить кеширование запросов** из PostgreSQL в Redis.
2. **Реализовать batch-обработку** событий для снижения нагрузки на БД.
3. **Настроить мониторинг** Lag Kafka Consumer через Grafana.
4. **Добавить обработку ошибок** (retry для Kafka, dead-letter queue).

Теперь у вас есть два полноценных микросервиса, взаимодействующих через Kafka, Redis и PostgreSQL. Осталось настроить Grafana и протестировать систему под нагрузкой!