import { Module } from '@nestjs/common'
import { UserModule } from './modules/user/user.module'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './modules/user/entities/user.entity'
import { RefreshToken } from './modules/auth/entities/refresh-token.entity'
import { EventsModule } from './modules/events/events.module'
import { Event } from './modules/events/entities/event.entity';
import { AuthModule } from './modules/auth/auth.module'
import { APP_GUARD } from '@nestjs/core'
import { RolesGuard } from './modules/auth/roles.guard'

@Module({
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Event, RefreshToken],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: true,
    }),
    UserModule,
    EventsModule,
    AuthModule
  ],
})
export class AppModule {}
