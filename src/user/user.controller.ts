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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo người dùng mới' })
  @ApiResponse({ status: 201, description: 'Tạo người dùng thành công' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách người dùng với phân trang con trỏ' })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách người dùng thành công',
  })
  findAll(
    @Query('cursor') cursor?: string,
    @Query('limit') limit: number = 10,
  ) {
    return this.userService.findAll(cursor, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin người dùng theo ID' })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin người dùng thành công',
  })
  findOne(@Param('id') id: number) {
    const user = this.userService.findById(id);
    return plainToInstance(CreateUserDto, user);
  }

  @Patch('update')
  @ApiOperation({ summary: 'Cập nhật thông tin người dùng' })
  @ApiResponse({ status: 200, description: 'Cập nhật người dùng thành công' })
  update(@Body() payload: CreateUserDto) {
    return this.userService.update(2, payload);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Xóa người dùng theo ID' })
  @ApiResponse({ status: 200, description: 'Xóa người dùng thành công' })
  delete(@Param('id') id: number) {
    return this.userService.delete(Number(id));
  }
}
