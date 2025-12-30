// src/queues/file/file.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { FileProcessor } from './file.processor';
import { S3Module } from '../../s3/s3.module';
import { FileQueueService } from './file.serviec';
import { UserModule } from 'src/user/user.module';
import { FileQueueListener } from './file.listener';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'file_queue',
    }),
    BullBoardModule.forFeature({
      name: 'file_queue',
      adapter: BullMQAdapter,
    }),
    S3Module,
    UserModule,
  ],
  providers: [FileQueueService, FileProcessor, FileQueueListener],
  exports: [FileQueueService],
})
export class FileModule {}
