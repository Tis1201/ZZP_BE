import { Body, Controller, Post, Req } from '@nestjs/common';
import { PresignUploadDto } from './dto/presign.dto';
import { ConfirmUploadDto } from './dto/confirm.dto';
import { S3Service } from './s3.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('S3 Uploads')
@Controller('uploads')
export class S3Controller {
  constructor(private readonly uploadsService: S3Service) {}

  @Post('presign/avatar')
  @ApiOperation({ summary: 'Lấy URL presign để upload avatar lên S3' })
  @ApiResponse({ status: 200, description: 'Lấy URL presign thành công' })
  async presignAvatar(@Req() req: any, @Body() dto: PresignUploadDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const id = req.user.sub;
    return this.uploadsService.presignUpload(id, dto);
  }

  @Post('confirm')
  @ApiOperation({ summary: 'Xác nhận hoàn tất upload file lên S3' })
  @ApiResponse({ status: 200, description: 'Xác nhận thành công' })
  confirm(@Body() dto: ConfirmUploadDto, @Req() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const id = req.user.sub;
    return this.uploadsService.requestConfirm(id, dto.key);
  }
}
