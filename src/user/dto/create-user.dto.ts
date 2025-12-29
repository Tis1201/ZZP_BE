/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Exclude, Expose } from 'class-transformer';
import { IsString, MaxLength } from 'class-validator';

@Exclude()
export class CreateUserDto {
  @Expose()
  @IsString({ message: 'Please enter your full name' })
  @MaxLength(110, { message: 'Your full name must be 110 character' })
  username: string;

  @Expose()
  @IsString({ message: 'Please enter your password' })
  @MaxLength(255, { message: 'Your password must be 255 character' })
  password: string;
}
