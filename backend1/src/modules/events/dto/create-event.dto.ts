import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { EventStatus, EventType } from '../entities/event.entity';

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
