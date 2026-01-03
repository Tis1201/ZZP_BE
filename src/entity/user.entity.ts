import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Profile } from './profile.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatarKey: string | null;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;
}
