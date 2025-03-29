import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create(userData: CreateUserDto) {
    const newUser = this.usersRepository.create(userData);
    return this.usersRepository.save(newUser);
  }

  async update(id: number, updateData: CreateUserDto)  {
    await this.usersRepository.update(id, updateData);
    return this.usersRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    await this.usersRepository.delete(id);
  }
}