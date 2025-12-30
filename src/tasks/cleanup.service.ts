// src/tasks/cleanup.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);

  @Cron('*/10 * * * * *', {
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  handleDailyCleanup() {
    this.logger.debug('Bắt đầu chạy tác vụ dọn dẹp lúc!!!...');
    this.logger.debug('Hoàn thành tác vụ.');
  }
}
