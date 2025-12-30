/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsString, MaxLength } from 'class-validator';

@Exclude()
export class CreateUserDto {
  @ApiProperty({
    example: 'vu.luu12@zzp.vn',
    description: 'Tên đăng nhập của người dùng',
    maxLength: 110,
  })
  @Expose()
  @IsString({ message: 'Please enter your full name' })
  @MaxLength(110, { message: 'Your full name must be 110 character' })
  username: string;

  @ApiProperty({
    example: 'password123',
    description: 'Mật khẩu của người dùng',
    maxLength: 255,
  })
  @Expose()
  @IsString({ message: 'Please enter your password' })
  @MaxLength(255, { message: 'Your password must be 255 character' })
  password: string;
}
