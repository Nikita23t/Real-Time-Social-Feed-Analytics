import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Entity()
export class WebSocketSubscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clientId: string;

  @Column('jsonb')
  eventTypes: string[];

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.websocketSubscriptions)
  user: User;
}