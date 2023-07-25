import { type } from 'os';
import { User } from 'src/users/entity/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'nvarchar',
  })
  token: string;

  @Column({
    type: 'nvarchar',
  })
  deviceId: string;

  @ManyToOne(() => User, (user) => user.id)
  user: number;
}
