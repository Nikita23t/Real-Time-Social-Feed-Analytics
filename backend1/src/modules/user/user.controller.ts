import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
  } from '@nestjs/common';
import { UsersService } from './user.service';
import { User } from './entities/user.entity';

  
  @Controller('users')
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}
  
    @Get()
    findAll(): Promise<User[]> {
      return this.usersService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.usersService.findOne(+id);
    }
  
    @Post()
    create(@Body() userData: Partial<User>): Promise<User> {
      return this.usersService.create(userData);
    }
  
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateData: Partial<User>) {
      return this.usersService.update(+id, updateData);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
      return this.usersService.remove(+id);
    }
  }