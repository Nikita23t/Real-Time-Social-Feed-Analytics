import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';


@Module({
    providers: [EventsService],
    controllers: [EventsController],
    imports: [TypeOrmModule.forFeature([Event])],
    exports: [TypeOrmModule],
})
export class EventsModule {}
