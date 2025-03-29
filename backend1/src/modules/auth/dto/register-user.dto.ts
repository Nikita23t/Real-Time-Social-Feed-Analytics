import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/, {
    message: 'Password too weak',
  })
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(30)
  username?: string;
}