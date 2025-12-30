import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

// DTO cho Metadata
export class CursorMetadataDto {
  @ApiProperty({
    example: '3',
    description: 'Cursor cho trang tiếp theo',
    nullable: true,
  })
  @Expose()
  nextCursor: string | null;

  @ApiProperty({
    example: true,
    description: 'Cho biết có trang tiếp theo hay không',
  })
  @Expose()
  hasNextPage: boolean;

  @ApiProperty({
    example: 10,
    description: 'Giới hạn số lượng bản ghi trên mỗi trang',
  })
  @Expose()
  limit: number;
}

export class PaginatedUserResponseDto {
  @ApiProperty({
    example: [CreateUserDto],
    type: [CreateUserDto],
    description: 'Danh sách người dùng',
  })
  @Expose()
  @Type(() => CreateUserDto)
  data: CreateUserDto[];

  @ApiProperty({
    example: CursorMetadataDto,
    type: CursorMetadataDto,
    description: 'Metadata phân trang',
  })
  @Expose()
  @Type(() => CursorMetadataDto)
  metadata: CursorMetadataDto;
}
