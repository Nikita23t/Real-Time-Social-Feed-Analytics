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
import { UserDto } from './dto/user.dto';
import { Auth } from 'src/common/decorators/auth.decorator';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Auth("admin")
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Auth("admin")
  @Get(':id')
  findUserById(@Param('id') id: string) {
    return this.usersService.findUserById(+id);
  }

  @Auth("admin")
  @Get(':email')
  findUserByEmail(@Param('email') email: string) {
    return this.usersService.getUserByEmail(email);
  }

  @Auth("admin")
  @Post()
  createUser(@Body() userDto: UserDto) {
    return this.usersService.createUser(userDto);
  }

  @Auth("admin")
  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() userDto: UserDto) {
    return this.usersService.updateUser(+id, userDto);
  }

  @Auth("admin")
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(+id);
  }
}