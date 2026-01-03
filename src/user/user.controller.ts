/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Patch,
  Delete,
  Req,
  Param,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { plainToInstance } from 'class-transformer';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo người dùng mới' })
  @ApiResponse({ status: 201, description: 'Tạo người dùng thành công' })
  @ApiBearerAuth('access-token')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('list')
  @ApiOperation({ summary: 'Lấy danh sách người dùng với phân trang con trỏ' })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách người dùng thành công',
  })
  @ApiBearerAuth('access-token')
  findAll(
    @Query('cursor') cursor?: string,
    @Query('limit') limit: number = 10,
  ) {
    return this.userService.findAll(cursor, limit);
  }

  @Get('user-info')
  @ApiOperation({ summary: 'Lấy thông tin người dùng theo ID' })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin người dùng thành công',
  })
  findOne(@Req() req: any) {
    const id = req.user.sub;
    const user = this.userService.findById(id);
    return plainToInstance(CreateUserDto, user);
  }

  @Patch('update')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Cập nhật thông tin người dùng' })
  @ApiResponse({ status: 200, description: 'Cập nhật người dùng thành công' })
  update(@Body() payload: CreateUserDto, @Req() req: any) {
    const id = req.user.sub;
    return this.userService.update(id, payload);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Xóa người dùng theo ID' })
  @ApiResponse({ status: 200, description: 'Xóa người dùng thành công' })
  @ApiBearerAuth('access-token')
  delete(@Param('id') id: string) {
    return this.userService.delete(Number(id));
  }
}
