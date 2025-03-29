import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Webhook } from './entities/webhook.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';


@Module({
    providers: [EventsService],
    controllers: [EventsController],
    imports: [TypeOrmModule.forFeature([Event, Webhook])],
    exports: [TypeOrmModule],
})
export class EventsModule {}
