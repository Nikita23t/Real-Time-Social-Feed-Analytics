import { EventType, EventStatus } from '../entities/event.entity';

export class EventResponseDto {
  id: string;
  type: EventType;
  payload: Record<string, any>;
  status: EventStatus;
  createdAt: Date;
  kafkaOffset?: number;
}