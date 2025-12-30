import { Expose, Type } from 'class-transformer';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

// DTO cho Metadata
export class CursorMetadataDto {
  @Expose()
  nextCursor: string | null;

  @Expose()
  hasNextPage: boolean;

  @Expose()
  limit: number;
}

export class PaginatedUserResponseDto {
  @Expose()
  @Type(() => CreateUserDto)
  data: CreateUserDto[];

  @Expose()
  @Type(() => CursorMetadataDto)
  metadata: CursorMetadataDto;
}
