import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { LoginInput } from './dto/login.input';
import { compare } from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './token-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  async login({ email, password }: LoginInput, response: Response) {
    const user = await this.verifyUser(email, password);
    const expires = new Date();
    expires.setMilliseconds(
      expires.getTime() +
        parseInt(this.configService.getOrThrow('JWT_EXPIRES_MS'))
    );

    const tokenPayload: TokenPayload = {
      userId: user.id,
    };
    const accessToken = this.jwtService.sign(tokenPayload);
    response.cookie('Authentication', accessToken, {
      expires,
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
    });

    return user;
  }
  private async verifyUser(email: string, password: string) {
    try {
      const user = await this.usersService.getUser({ email });
      const isAuthenticated = compare(password, user.password);
      if (!isAuthenticated) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (err) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
