import { IsEmail, IsString, Length } from 'class-validator';

export class RegisterUserDto {
  
  @IsEmail()
  email: string;

  @Length(6, 64)
  @IsString()
  password: string;
}