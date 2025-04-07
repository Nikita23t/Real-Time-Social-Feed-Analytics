import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event, EventStatus, EventType } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { LikeDto } from './dto/like.dto';

@Injectable()
export class EventsService {
    constructor(
        @InjectRepository(Event)
        private eventRepository: Repository<Event>,
    ) { }

    async getAllPosts() {
        return this.eventRepository.find({
            where: { type: EventType.POST },
            relations: ['user']
        });
    }

    async createPost(dto: CreateEventDto) {
        const post = this.eventRepository.create(dto);
        return this.eventRepository.save(post);
      }
      

    async deletePost(id: number) {
        return this.eventRepository.delete(id);
    }

    async updatePost(id: number, dto: UpdateEventDto) {
        return this.eventRepository.update(id, dto);
    }

    async getCommentsOfPost(postId: number) {
        return this.eventRepository.find({
            where: { type: EventType.COMMENT, postId },
            relations: ['user'],
        });
    }

    async createComment(dto: CreateEventDto) {
        const comment = this.eventRepository.create(dto);
        return this.eventRepository.save(comment);
    }

    async deleteComment(id: number) {
        return this.eventRepository.delete(id);
    }

    async updateComment(id: number, dto: UpdateEventDto) {
        return this.eventRepository.update(id, dto);
    }

    async toggleLike(dto: LikeDto) {

        const existingLike = await this.eventRepository.findOne({
            where: {
                user: { id: dto.userId },
                type: EventType.LIKE,
                ...(dto.postId ? { postId: dto.postId } : { commentId: dto.commentId }),
            },
        });

        if (existingLike) {
            await this.eventRepository.delete(existingLike.id);
        } else {
            const newLike = this.eventRepository.create({
                type: EventType.LIKE,
                user: { id: dto.userId },
                postId: dto.postId,
                commentId: dto.commentId,
                status: EventStatus.SENT,
            });
            await this.eventRepository.save(newLike);
        }

        const likesCount = await this.eventRepository.count({
            where: {
                type: EventType.LIKE,
                ...(dto.postId ? { postId: dto.postId } : { commentId: dto.commentId }),
            },
        });

        return { likesCount };
    }

    async getLikesCount(target: { postId?: number; commentId?: number }) {
        return this.eventRepository.count({
            where: {
                type: EventType.LIKE,
                ...(target.postId
                    ? { postId: target.postId }
                    : { commentId: target.commentId }),
            },
        });
    }
}