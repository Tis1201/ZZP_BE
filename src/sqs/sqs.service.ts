// src/sqs/sqs.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { SqsService as SqsLibService } from '@ssut/nestjs-sqs';

@Injectable()
export class SqsService {
  private readonly logger = new Logger(SqsService.name);

  constructor(private readonly sqsLibService: SqsLibService) {}

  async sendMessage(body: any) {
    const message = {
      id: `msg-${Date.now()}`,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      body: body,
    };

    try {
      this.logger.log(`Đang gửi tin nhắn: ${JSON.stringify(body)}`);

      await this.sqsLibService.send('backend-queue', message);

      this.logger.log('Gửi thành công!');
    } catch (error) {
      this.logger.error('Lỗi khi gửi SQS:', error);
      throw error;
    }
  }
}
