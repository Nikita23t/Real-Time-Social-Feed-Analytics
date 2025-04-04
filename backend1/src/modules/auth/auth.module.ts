import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RateLimit } from './entities/rate-limit.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';

@Module({
    providers: [AuthService],
    controllers: [AuthController],
    imports: [
        TypeOrmModule.forFeature([RateLimit, RefreshToken, User]),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: process.env.JWT_EXPIRESIN },
        }),
      ],
})
export class AuthModule {}
