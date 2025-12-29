import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { scryptSync, timingSafeEqual } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  createAccessToken(payload: any) {
    return this.jwtService.sign(payload, {
      expiresIn: '3m',
      secret: this.configService.get<string>('JWT_SECRET_AC'),
    });
  }

  createRefreshToken(payload: any) {
    return this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: this.configService.get<string>('JWT_SECRET_RF'),
    });
  }

  comparePassword(password: string, dbPassword: string) {
    const [salt, key] = dbPassword.split(':');
    const keyBuffer = Buffer.from(key, 'hex');
    const derivedKey = scryptSync(password, salt, 64);
    return timingSafeEqual(keyBuffer, derivedKey);
  }

  async login(
    createAuthDto: CreateAuthDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.userService.findOne(createAuthDto.username);
    if (!user) throw new NotFoundException('User not found');

    const isMatch = this.comparePassword(createAuthDto.password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Username or password incorrect.');
    }

    const payload = {
      sub: user.id,
    };

    const access_token = this.createAccessToken(payload);
    const refresh_token = this.createRefreshToken(payload);
    return { access_token: access_token, refresh_token: refresh_token };
  }

  async refresh(refreshToken: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET_RF'),
      });
      const newAccessToken = this.createAccessToken(payload);
      return { access_token: newAccessToken };
    } catch (e) {
      throw new UnauthorizedException(
        e,
        'Refresh Token không hợp lệ hoặc đã hết hạn',
      );
    }
  }
}
