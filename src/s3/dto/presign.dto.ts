import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

@Exclude()
export class PresignUploadDto {
  @ApiProperty({
    example: 'image/jpeg',
    description: 'Loại nội dung của file (content type)',
  })
  @Expose()
  @IsString()
  contentType: string;

  @ApiProperty({
    example: 204800,
    description: 'Kích thước của file tính bằng byte',
    minimum: 1,
    maximum: 10485760,
  })
  @Expose()
  @IsInt()
  @Min(1)
  @Max(10 * 1024 * 1024)
  size: number;

  @ApiProperty({
    example: 'file_name.jpg',
    description: 'Tên file (có thể để trống)',
    required: false,
  })
  @Expose()
  @IsOptional()
  @IsString()
  fileName?: string;
}

export class PresignUploadResponseDto {
  key: string;
  uploadUrl: string;
  expiresIn: number;
  publicUrl: string;
}
