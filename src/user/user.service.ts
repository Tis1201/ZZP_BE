// src/modules/user/user.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { randomBytes, scryptSync } from 'crypto';
import { Paginator } from 'src/utils/paginator.util';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
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
    return this.userRepo.save({ ...dto, password: hashed });
  }

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

  findById(id: number) {
    return this.userRepo.findOne({ where: { id } });
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
