import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Đăng nhập người dùng' })
  @ApiResponse({ status: 200, description: 'Đăng nhập thành công' })
  login(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.login(createAuthDto);
  }

  @Post('sign-up')
  @HttpCode(201)
  @ApiOperation({ summary: 'Đăng ký người dùng mới' })
  @ApiResponse({ status: 201, description: 'Đăng ký thành công' })
  signup(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('refresh-token')
  @HttpCode(200)
  @ApiOperation({ summary: 'Làm mới token' })
  @ApiResponse({ status: 200, description: 'Làm mới token thành công' })
  refresh(@Body() refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }
}
