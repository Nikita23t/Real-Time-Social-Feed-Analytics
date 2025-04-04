import { RateLimit } from 'src/modules/auth/entities/rate-limit.entity'
import { RefreshToken } from 'src/modules/auth/entities/refresh-token.entity'
import { Webhook } from 'src/modules/events/entities/webhook.entity'
import { WebSocketSubscription } from 'src/modules/websocket/websocket-subscription.entity'
import { Event } from 'src/modules/events/entities/event.entity'

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  email: string

  @Column()
  passwordHash: string

  @Column({ unique: true, nullable: true })
  username?: string

  @Column({ default: 'USER' })
  role: string

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date



  
  @OneToMany(() => RefreshToken, rt => rt.user)
  refreshTokens: RefreshToken[]

  @OneToMany(() => RateLimit, rl => rl.user)
  rateLimits: RateLimit[]

  @OneToMany(() => Event, (event) => event.user) 
  events: Event[]

  @OneToMany(() => Webhook, wh => wh.user)
  webhooks: Webhook[]

  @OneToMany(() => WebSocketSubscription, ws => ws.user)
  websocketSubscriptions: WebSocketSubscription[]
}
