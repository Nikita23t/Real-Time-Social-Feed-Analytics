import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    ForbiddenException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { ROLES_KEY } from '../decorators/auth.decorator';
  import { JwtService } from '@nestjs/jwt';
  import { Request } from 'express';
  import { InjectRepository } from '@nestjs/typeorm';
  import { User } from 'src/modules/user/entities/user.entity';
  import { Repository } from 'typeorm';
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(
      private reflector: Reflector,
      private jwtService: JwtService,
      @InjectRepository(User)
      private userRepository: Repository<User>,
    ) {}
  
    async canActivate(context: ExecutionContext) {
      const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
  
      const request = context.switchToHttp().getRequest<Request>();
      const authHeader = request.headers.authorization;
  
      if (!authHeader) {
        throw new UnauthorizedException('Отсутствует заголовок авторизации');
      }
  
      const token = authHeader.split(' ')[1];
  
      if (!token) {
        throw new UnauthorizedException('Токен не предоставлен');
      }
  
      try {
        const decoded = this.jwtService.verify(token, {
          secret: process.env.JWT_ACCESS_SECRET,
        });
  
        const user = await this.userRepository.findOne({ where: { id: decoded.sub } });
  
        if (!user) {
          throw new UnauthorizedException('Пользователь не найден');
        }
  
        request['user'] = user;
  
        if (roles.length && !roles.includes(user.role)) {
          throw new ForbiddenException('Недостаточно прав');
        }
  
        return true;
      } catch (error) {
        throw new UnauthorizedException('Недействительный токен');
      }
    }
  }