import { User } from 'src/modules/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';

@Entity()
export class RateLimit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 45 })
  ip: string;

  @Column()
  endpoint: string;

  @Column({ default: 1 })
  count: number;

  @CreateDateColumn()
  lastRequest: Date;

  @ManyToOne(() => User, (user) => user.rateLimits, { nullable: true })
  user?: User;
}