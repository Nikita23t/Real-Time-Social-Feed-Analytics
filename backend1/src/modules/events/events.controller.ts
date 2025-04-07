import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { UpdateEventDto } from './dto/update-event.dto';
import { LikeDto } from './dto/like.dto';
import { CreateEventDto } from './dto/create-event.dto';


@Controller('/events')
export class EventsController {
  constructor(private eventService: EventsService) { }


  @Get('/')
  async getAllPosts() {
    return this.eventService.getAllPosts()
  }

  @Post('/:id')
  async createPost(@Param("id") id: number, dto: CreateEventDto) {
    return this.eventService.createPost(dto)
  }

  @Delete('/:id')
  async deletePost(@Param("id") id: number) {
    return this.eventService.deletePost(id)
  }

  @Patch('/:id')
  async updatePost(@Param("id") id: number, @Body() dto: UpdateEventDto) {
    return this.eventService.updatePost(id, dto)
  }

  @Get('/comments/:id')
  async getCommentsOfPost(@Param("id") id: number) {
    return this.eventService.getCommentsOfPost(id)
  }

  @Post('/comments/:id')
  async createComments(@Param("id") id: number, dto: CreateEventDto) {
    return this.eventService.createPost(dto)
  }

  @Delete('/comments/:id')
  async deleteComment(@Param("id") id: number) {
    return this.eventService.deleteComment(id)
  }

  @Patch('/comments/:id')
  async updateComment(@Param("id") id: number, dto: UpdateEventDto) {
    return this.eventService.updateComment(id, dto)
  }

  @Post('likes/toggle')
  async toggleLike(@Body() dto: LikeDto) {
    return this.eventService.toggleLike(dto);
  }

  @Get('likes/count')
  async getLikesCount(@Body() dto: LikeDto) {
    return this.eventService.getLikesCount(dto);
  }

}
