import { IsEnum, IsObject, IsOptional, IsUUID } from 'class-validator';
import { EventType } from '../entities/event.entity';

export class CreateEventDto {
  @IsEnum(EventType)
  type: EventType;

  @IsObject()
  payload: Record<string, any>;

  @IsUUID()
  @IsOptional() 
  userId?: string;
}