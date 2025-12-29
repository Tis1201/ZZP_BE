import { Exclude, Expose } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

@Exclude()
export class PresignUploadDto {
  @Expose()
  @IsString()
  contentType: string;

  @Expose()
  @IsInt()
  @Min(1)
  @Max(10 * 1024 * 1024)
  size: number;

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
