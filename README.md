 

---

### **Проект: Real-Time Social Feed & Analytics**  
_Микросервисная система для обработки событий социальной сети (лайки, посты, комментарии) с аналитикой и уведомлениями._

---

### 🏗 Архитектура

```ini
                          Клиент (Web/Mobile)
                                 │
                                 ├── REST API (API Gateway) ──┐
                                 │                           │
                                 └── WebSocket (API Gateway) │
                                                             │
                                 Kafka (Центральный брокер)  │
                                   ├── topic: user-actions   │
                                   └── topic: notifications  │
                                                             │
┌────────────────────────────────────────────────────────────┤
│                                                          │  │
│ Микросервис 1: API Gateway (Nest.js)                     │  │
│   - REST: Приём событий (POST /api/events)               │  │
│   - WebSocket: Рассылка уведомлений клиентам             │  │
│   - JWT Auth / Rate Limiting                            │  │
│   - Kafka Producer (user-actions)                       │  │
│                                                          │  │
├──────────────────────────────────────────────────────────│  │
│                                                          │  │
│ Микросервис 2: Event Processor (Nest.js)                 │  │
│   - Kafka Consumer (user-actions)                        │◀┘  
│   - Аналитика: агрегация данных в PostgreSQL             │
│   - Real-time счётчики в Redis (например, топ постов)    │
│   - Отправка алертов в Kafka (notifications)             │───┐
│                                                          │   │
└──────────────────────────────────────────────────────────┘   │
                                                             │  │
Grafana Dashboard ◀── [PostgreSQL (история) + Redis (realtime)]  │
                                                             │  │
                                                             │  │
                                 Alert Engine (в составе Event Processor)
                                   - Анализ данных → Kafka (notifications)
```

---

### 🧩 Распределение задач между микросервисами

**1. API Gateway Service**  
- **REST API**:
  - Валидация входящих событий (например, схема лайка: `{ userId, postId, type: 'like' }`).
  - Аутентификация через JWT.
  - Rate Limiting (например, не более 100 запросов/мин с одного IP).
  - Отправка событий в Kafka топик `user-actions`.
  
- **WebSocket**:
  - Поддержка подключений клиентов через WS.
  - Подписка на топик Kafka `notifications`.
  - Рассылка уведомлений в реальном времени (например, "Ваш пост получил 100 лайков").

**2. Event Processor Service**  
- **Kafka Consumer**:
  - Чтение событий из `user-actions`.
  - Обработка и обогащение данных (например, добавление timestamp).
  
- **Работа с данными**:
  - Сохранение сырых событий в PostgreSQL.
  - Агрегация данных (например, подсчёт лайков за день через SQL оконные функции).
  - Обновление Redis-счётчиков (например, `INCR post:123:likes`, `ZADD top_posts 150 post:123`).

- **Alert Engine**:
  - Мониторинг аномалий (например, резкий рост лайков → проверка на накрутку).
  - Генерация уведомлений → отправка в Kafka `notifications`.

---

### 🛠 Примеры технологических решений

**Для API Gateway**:
```typescript
// kafka-producer.service.ts
@Injectable()
export class KafkaProducer {
  constructor(private readonly kafkaService: KafkaService) {}

  async sendEvent(payload: UserActionEvent) {
    await this.kafkaService.emit('user-actions', {
      key: payload.userId, // Партицирование по userId
      value: JSON.stringify(payload),
    });
  }
}

// websocket.gateway.ts
@WebSocketGateway()
export class WsGateway {
  @SubscribeTo('notifications')
  handleNotification(payload: string) {
    this.server.emit('notification', payload); // Рассылка всем клиентам
  }
}
```

**Для Event Processor**:
```typescript
// kafka-consumer.service.ts
@KafkaListener('user-actions')
async handleUserActions(
  @Payload() message: KafkaMessage,
) {
  const event = JSON.parse(message.value.toString());
  await this.postgresService.saveEvent(event);
  await this.redisClient.zIncrBy('top_posts', 1, `post:${event.postId}`);
  
  // Проверка триггеров для алертов
  if (await this.isFraudDetected(event)) {
    this.kafka.emit('notifications', { type: 'FRAUD', data: event });
  }
}
```

---

### 📊 Интеграция с Grafana

1. **PostgreSQL Data Source**:
   - Дашборд "Историческая аналитика":
     - График активности по часам: `SELECT COUNT(*), date_trunc('hour', timestamp) FROM events GROUP BY ...`.
     - Топ-10 постов за месяц.

2. **Redis Data Source**:
   - Дашборд "Real-time метрики":
     - Текущее количество лайков: `GET post:123:likes`.
     - Топ постов: `ZREVRANGE top_posts 0 9 WITHSCORES`.

3. **Kafka Monitoring**:
   - Lag потребителей, throughput топиков (через Prometheus + JMX Exporter).

---

### 🚀 Как запустить проект

1. **Infrastructure** (docker-compose.yml):
```yaml
services:
  zookeeper:
    image: confluentinc/cp-zookeeper
  kafka:
    image: confluentinc/cp-kafka
  redis:
    image: redis
  postgres:
    image: postgres
  grafana:
    image: grafana/grafana
```

2. **Микросервисы**:
```bash
# API Gateway
cd api-gateway && npm run start:dev

# Event Processor
cd event-processor && npm run start:dev
```

---

### 💡 Что изучите

1. Разделение ответственности между микросервисами.
2. Паттерны взаимодействия: API Gateway → Kafka → Event Processor.
3. Синхронизация данных между PostgreSQL и Redis.
4. Реализация WebSocket + Kafka для real-time.
5. Оптимизация запросов: кеширование в Redis, batch-обработка в PostgreSQL.

---

### 🔥 Возможные улучшения

1. **Добавить третий микросервис**:
   - **Notification Service**: Отправка email/push-уведомлений на основе алертов.

2. **Тестирование**:
   - Нагрузочные тесты API Gateway (Artillery).
   - Интеграционные тесты Kafka (Testcontainers).

3. **Безопасность**:
   - Шифрование данных в Kafka (SSL/SASL).
   - Роли в Redis (ACL).

Такой проект отлично покажет ваши навыки проектирования распределённых систем. Удачи!