import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { plainToInstance } from 'class-transformer';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(
    @Query('cursor') cursor?: string,
    @Query('limit') limit: number = 10,
  ) {
    return this.userService.findAll(cursor, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    const user = this.userService.findById(id);
    return plainToInstance(CreateUserDto, user);
  }

  @Patch('update')
  update(@Body() payload: CreateUserDto) {
    return this.userService.update(2, payload);
  }

  @Delete('delete/:id')
  delete(@Param('id') id: number) {
    return this.userService.delete(Number(id));
  }
}
