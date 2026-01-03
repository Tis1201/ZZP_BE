/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SqsService } from 'src/sqs/sqs.service';
import { Profile } from 'src/entity/profile.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
    private readonly sqsqService: SqsService,
  ) {}

  create(createProfileDto: CreateProfileDto) {
    return 'This action adds a new profile';
  }

  findAll() {
    return `This action returns all profile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} profile`;
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    await this.profileRepo.update(id, updateProfileDto);
    const profile = await this.profileRepo.findOneBy({ id });
    await this.sqsqService.sendMessage({
      event: 'UPDATE_PROFILE',
      data: profile,
    });
    return profile;
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
