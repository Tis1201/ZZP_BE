import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class ConfirmUploadDto {
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
