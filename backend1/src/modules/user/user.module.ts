import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';

@Module({
    providers: [UsersService],
    controllers: [UsersController],
    imports: [TypeOrmModule.forFeature([User])],
})
export class UserModule {}
