import { IsArray, IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
import { EventType } from '../entities/event.entity';

export class CreateWebhookDto {
  @IsUrl()
  url: string;

  @IsArray()
  @IsEnum(EventType, { each: true })
  eventTypes: EventType[];

  @IsString()
  @IsOptional()
  secret?: string;
}