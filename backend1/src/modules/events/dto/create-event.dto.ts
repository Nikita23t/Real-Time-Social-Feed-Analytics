import { IsEnum, IsNumber, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { EventStatus, EventType } from '../entities/event.entity';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @IsEnum(EventType)
  type: EventType;

  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus;

  data: string;

  @IsOptional()
  postId?: number;

  @IsOptional()
  commentId?: number;

  @IsNumber()
  userId: number;
}
