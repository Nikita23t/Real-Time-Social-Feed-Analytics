import { IsOptional } from "class-validator";

export class LikeDto {
    userId: number;
  
    @IsOptional()
    postId?: number;
  
    @IsOptional()
    commentId?: number;
  }