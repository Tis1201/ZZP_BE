// src/sqs/sqs.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SqsModule as NestSqsModule } from '@ssut/nestjs-sqs';
import { SqsService } from './sqs.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    NestSqsModule.register({
      producers: [
        {
          name: 'backend-queue',
          queueUrl: process.env.SQS_QUEUE_URL!,
          region: process.env.AWS_REGION!,
        },
      ],
    }),
  ],
  providers: [SqsService],
  exports: [SqsService],
})
export class SqsModule {}
