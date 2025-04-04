import { IsString } from "class-validator"

export class UserDto {

    email: string
    password: string

    @IsString()
    username?: string

    @IsString()
    role: string
}
