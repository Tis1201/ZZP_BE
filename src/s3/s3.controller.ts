import { Body, Controller, Post, Req } from '@nestjs/common';
import { PresignUploadDto } from './dto/presign.dto';
import { ConfirmUploadDto } from './dto/confirm.dto';
import { S3Service } from './s3.service';

@Controller('uploads')
export class S3Controller {
  constructor(private readonly uploadsService: S3Service) {}

  @Post('presign/avatar')
  async presignAvatar(@Req() req: any, @Body() dto: PresignUploadDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const userId = req.user?.id ?? 1;
    return this.uploadsService.presignUpload(userId, dto);
  }

  @Post('confirm')
  async confirm(@Body() dto: ConfirmUploadDto) {
    return this.uploadsService.confirm(dto.key);
  }
}
