import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class RegisterDto {
    // @IsEmail()
    // @IsNotEmpty()
    // @IsString()
    email: string;
  
    // @Length(6,  16)
    // @IsNotEmpty()
    // @IsString()
    password: string;
  }