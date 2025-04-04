import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/modules/user/entities/user.entity';
import { RefreshToken } from 'src/modules/auth/entities/refresh-token.entity';
import { RegisterDto } from '../user/dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
  ) { }

  async login(identifier: string, password: string) {
    const user = await this.usersRepository.findOne({ where: [{ email: identifier }, { username: identifier }] });
    const passwordEquals = await bcrypt.compare(password, user?.passwordHash);
    if (!(user && passwordEquals)) {
      throw new UnauthorizedException({message: 'Некорректный емайл или пароль'})
    }
    return this.generateTokens(user);
  }

  async register(email: string, password: string) {
    console.log(email)
    console.log(password)
  
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

  
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      email,
      passwordHash: hashedPassword,
      username: email
    });
    
    await this.usersRepository.save(user);
    return this.generateTokens(user);
  }
  
  async generateTokens(user: User) {
    const payload = { username: user.username, sub: user.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = await this.createRefreshToken(user.id);
    return { accessToken, refreshToken };
  }

  async createRefreshToken(userId: number): Promise<string> {
    const refreshToken = this.jwtService.sign({ userId }, { expiresIn: '7d' });
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
      throw new UnauthorizedException('ошибка в refrash token');
    }
    const accessToken = this.jwtService.sign({ username: tokenEntity.user.username, sub: tokenEntity.user.id }, { expiresIn: '15m' });
    return { accessToken };
  }
}
