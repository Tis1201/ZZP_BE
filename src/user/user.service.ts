/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/modules/user/user.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { randomBytes, scryptSync } from 'crypto';
import { RedisService } from 'src/redis/redis.service';
import { PaginatedUserResponseDto } from 'src/dto/cursor-response.dto';
import { plainToInstance } from 'class-transformer';
import { SqsService } from 'src/sqs/sqs.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly redisService: RedisService,
    private readonly sqsqService: SqsService,
  ) {}
  hashPassword(password: string) {
    const salt = randomBytes(16).toString('hex');
    const hashedPassword = scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hashedPassword}`;
  }

  async create(dto: CreateUserDto) {
    const hashed = this.hashPassword(dto.password);
    const user = await this.findOne(dto.username);
    if (user) throw new BadRequestException('Existing User');
    await this.sqsqService.sendMessage({ event: 'CREATE_USER', data: dto });
    return this.userRepo.save({ ...dto, password: hashed });
  }

  /*
  async findAll(page: number, limit: number) {
    const paginator = new Paginator(page, limit);
    const totalUser = await this.userRepo.count();
    const listUser = await this.userRepo.find({
      skip: paginator.offset,
      take: paginator.limit,
    });
    const metadata = paginator.getMetadata(totalUser);
    return {
      listUser,
      metadata,
    };
  }
    */

  async findAll(cursor: string | number | undefined, limit: number) {
    const queryLimit = Number(limit) || 10;

    const queryBuilder = this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect(
        'user.profile',
        'profile',
        'profile.deletedAt IS NULL',
      );

    if (cursor) {
      const cursorNumber = Number(cursor);
      queryBuilder.andWhere('user.id > :cursor', { cursor: cursorNumber });
    }
    queryBuilder.orderBy('user.id', 'ASC').take(limit + 1);

    const items = await queryBuilder.getMany();

    const hasNextPage = items.length > queryLimit;
    const data = hasNextPage ? items.slice(0, queryLimit) : items;
    const nextCursor =
      hasNextPage && data.length > 0
        ? data[data.length - 1].id.toString()
        : null;

    const result = {
      data,
      metadata: {
        nextCursor,
        hasNextPage,
        limit: queryLimit,
      },
    };

    return plainToInstance(PaginatedUserResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  async findById(id: number) {
    if (await this.redisService.get(id.toString())) {
      return this.redisService.get(id.toString());
    }
    const user = await this.userRepo.findOne({ where: { id } });
    await this.redisService.set(id.toString(), JSON.stringify(user), 300);
    return user;
  }

  async findOne(name: string) {
    return await this.userRepo.findOne({ where: { username: name } });
  }

  async update(id: number, data: Partial<CreateUserDto>) {
    await this.userRepo.update(id, data);
    return this.findById(id);
  }

  async updateAvatar(id: number, avatarKey: string) {
    return await this.userRepo.update(id, { avatarKey });
  }

  delete(id: number) {
    return this.userRepo.delete(id);
  }
}
