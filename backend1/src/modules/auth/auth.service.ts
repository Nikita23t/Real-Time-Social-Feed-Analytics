import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { RefreshToken } from 'src/modules/auth/entities/refresh-token.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
  ) { }

  async login(dto: LoginUserDto) {
    let user: User | null = null;

    if (dto.email) {
      user = await this.usersRepository.findOne({ where: { email: dto.email } });
    } else if (dto.username) {
      user = await this.usersRepository.findOne({ where: { username: dto.username } });
    } else {
      throw new UnauthorizedException({ message: 'Введите почту или имя пользователя' });
    }

    if (!user) {
      throw new UnauthorizedException({ message: 'Некорректный емайл или юзернейм' });
    }

    const passwordEquals = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordEquals) {
      throw new UnauthorizedException({ message: 'Некорректный пароль' });
    }

    return this.generateTokens(user);
  }

  async register(dto: RegisterUserDto) {
    console.log(dto.email);
    console.log(dto.password);

    const existingUser = await this.usersRepository.findOne({ where: { email: dto.email } });
    if (existingUser) {
      throw new ConflictException('Пользователь с данной почтой существует уже');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepository.create({
      email: dto.email,
      passwordHash: hashedPassword
    });

    await this.usersRepository.save(user);
    return this.generateTokens(user);
  }

  async generateTokens(user: User) {
    const payload = { username: user.username, sub: user.id };
    console.log(process.env.JWT_ACCESS_SECRET);
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = await this.createRefreshToken(user.id);
    return { accessToken, refreshToken };
  }

  async createRefreshToken(userId: number): Promise<string> {
    const refreshToken = this.jwtService.sign({ userId }, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '7d',
    });
    const refreshTokenEntity = this.refreshTokenRepository.create({
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      user: { id: userId } as User,
    });
    await this.refreshTokenRepository.save(refreshTokenEntity);
    return refreshToken;
  }

  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    const tokenEntity = await this.refreshTokenRepository.findOne({ where: { token: refreshToken }, relations: ['user'] });
    if (!tokenEntity) {
      throw new UnauthorizedException('ошибка в refresh token');
    }
    const accessToken = this.jwtService.sign({ username: tokenEntity.user.username, sub: tokenEntity.user.id }, { expiresIn: '15m' });
    return { accessToken };
  }
}
