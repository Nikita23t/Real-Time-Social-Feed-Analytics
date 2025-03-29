import { User } from 'src/modules/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';


export enum EventType {
  LIKE = 'like',
  COMMENT = 'comment',
  POST = 'post',
  SHARE = 'share',
}

export enum EventStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
}





@Entity()
export class Event {
  
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: EventType,
    default: EventType.LIKE,
  })
  type: EventType;

  @Column('jsonb')
  payload: Record<string, any>;

  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.PENDING,
  })
  status: EventStatus;

  @Column({ type: 'bigint', nullable: true })
  kafkaOffset?: number;

  @CreateDateColumn()
  createdAt: Date;




  @ManyToOne(() => User, (user) => user.events, { onDelete: 'CASCADE' })
user: User;

}