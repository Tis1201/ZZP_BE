import { IsOptional, IsPhoneNumber } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 11, nullable: true })
  @IsOptional()
  @IsPhoneNumber('VN', {
    message: 'Số điện thoại không đúng định dạng Việt Nam.',
  })
  phone_number: string;

  @Column()
  address: string;

  @Column()
  userId: number;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()
  user: User;
}
