import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class ConfirmUploadDto {
  @ApiProperty({ description: 'Key của file đã upload lên S3' })
  @Expose()
  @IsString()
  key: string;
}

export class ConfirmUploadResponseDto {
  key: string;
  publicUrl: string;
  contentType: string;
  size: number;
}
