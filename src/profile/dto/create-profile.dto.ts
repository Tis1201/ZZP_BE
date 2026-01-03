import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateProfileDto {
  @Expose()
  @ApiProperty({
    example: '0123456789',
    description: 'Số điện thoại của người dùng',
    maxLength: 15,
  })
  phone_number: string;

  @Expose()
  @ApiProperty({
    example: '123 Đường ABC, Quận 1, TP.HCM',
    description: 'Địa chỉ của người dùng',
  })
  address: string;
}
