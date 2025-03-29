import { IsEnum, IsOptional, IsISO8601, IsUUID } from 'class-validator';
import { EventType } from '../entities/event.entity';

export class EventFilterDto {
  @IsEnum(EventType)
  @IsOptional()
  type?: EventType;

  @IsISO8601()
  @IsOptional()
  start?: string;

  @IsISO8601()
  @IsOptional()
  end?: string;

  @IsOptional()
  @IsUUID()
  postId?: string;
}