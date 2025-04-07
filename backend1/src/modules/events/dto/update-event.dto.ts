import { IsOptional, IsEnum } from 'class-validator';
import { EventStatus } from '../entities/event.entity';

export class UpdateEventDto {
  @IsOptional()
  postId?: number;

  @IsOptional()
  commentId?: number;

  data: string;

  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;
}
