import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class VoProfile {
  @Expose()
  address: string;

  @Expose()
  phone_number: string;
}

@Exclude()
export class VoUser {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  @Type(() => VoProfile) // Định nghĩa kiểu dữ liệu để class-transformer hiểu
  profile: VoProfile;
}
