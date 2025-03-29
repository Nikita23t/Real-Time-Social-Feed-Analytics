import { IsArray, IsEnum, IsString } from 'class-validator';
import { EventType } from '../../events/entities/event.entity';

export class WebSocketMessageDto {
  @IsString()
  action: 'subscribe' | 'unsubscribe';

  @IsArray()
  @IsEnum(EventType, { each: true })
  eventTypes: EventType[];
}