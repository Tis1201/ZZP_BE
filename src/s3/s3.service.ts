import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PresignUploadDto } from './dto/presign.dto';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { UserService } from 'src/user/user.service';

const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'image/webp',
];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly publicBaseUrl: string;

  constructor(private readonly userService: UserService) {
    this.bucket = process.env.AWS_S3_BUCKET || '';
    this.publicBaseUrl =
      process.env.CDN_BASE_URL || process.env.AWS_S3_PUBLIC_BASE_URL || '';
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'ap-southeast-2',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
  }

  private buildPublicUrl(key: string): string {
    return `${this.publicBaseUrl.replace(/\/$/, '')}/${key}`;
  }

  private buildKey(userId: string, contentType: string) {
    const ext =
      contentType === 'image/png'
        ? 'png'
        : contentType === 'image/webp'
          ? 'webp'
          : 'jpg';
    return `users/${userId}/avatars/${randomUUID()}.${ext}`;
  }

  async presignUpload(userId: number, payload: PresignUploadDto) {
    if (!ALLOWED_FILE_TYPES.includes(payload.contentType)) {
      throw new Error('Invalid file type');
    }
    if (payload.size > MAX_FILE_SIZE) {
      throw new Error('File size exceeds the maximum limit');
    }

    const key = this.buildKey(userId.toString(), payload.contentType);
    const expiresIn = 300;

    const cmd = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: payload.contentType,
    });

    const uploadUrl = await getSignedUrl(this.s3Client, cmd, { expiresIn });
    await this.userService.updateAvatar(userId, key);
    return {
      key,
      uploadUrl,
      expiresIn,
      publicUrl: this.buildPublicUrl(key),
    };
  }

  async confirm(key: string) {
    if (!key.startsWith('users/')) {
      throw new BadRequestException('Invalid key');
    }
    try {
      const head = await this.s3Client.send(
        new HeadObjectCommand({ Bucket: this.bucket, Key: key }),
      );

      const contentType = head.ContentType ?? '';
      const size = head.ContentLength ?? 0;

      console.log('contentType received:', contentType);
      if (!ALLOWED_FILE_TYPES.includes(contentType)) {
        throw new BadRequestException('Uploaded file type not allowed');
      }
      if (size > MAX_FILE_SIZE) {
        throw new BadRequestException('Uploaded file too large');
      }

      return {
        key,
        publicUrl: this.buildPublicUrl(key),
        contentType,
        size,
      };
    } catch (e: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const status = e?.$metadata?.httpStatusCode;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (status === 404 || e?.name === 'NotFound') {
        throw new BadRequestException('File not found on S3');
      }
      throw e;
    }
  }
}
