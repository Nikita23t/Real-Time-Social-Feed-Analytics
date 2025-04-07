import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async findAll() {
    const users = await this.userRepository.find()
    return users;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } })
    return user;
  }

  async findUserById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async createUser(dto: UserDto) {
    const user = await this.userRepository.create(dto);
    return this.userRepository.save(user);
  }

  async updateUser(id: number, updateData: UserDto) {
    await this.userRepository.update(id, updateData);
    return this.userRepository.findOne({ where: { id } });
  }

  async deleteUser(id: number) {
    return this.userRepository.delete(id);
  }

}