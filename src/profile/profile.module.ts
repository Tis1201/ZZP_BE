import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule } from 'src/sqs/sqs.module';
import { Profile } from 'src/entity/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profile]), SqsModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
