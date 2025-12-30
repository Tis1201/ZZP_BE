// src/queues/file/file.processor.ts
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { S3Service } from '../../s3/s3.service';
import { UserService } from '../../user/user.service';

@Processor('file_queue')
export class FileProcessor extends WorkerHost {
  constructor(
    private readonly s3Service: S3Service,
    private readonly userService: UserService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { userId, key } = job.data;

    if (job.name === 'confirm-s3-upload') {
      const fileInfo = await this.s3Service.confirm(key);
      await this.userService.updateAvatar(userId, fileInfo.key);
      return { status: 'done' };
    }
  }
}
