import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { Roles } from 'utils/constant';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'nvarchar',
    length: 30,
  })
  firstName: string;

  @Column({
    type: 'nvarchar',
    length: 30,
  })
  lastName: string;

  @Column({
    type: 'nvarchar',
    length: 30,
    unique: true,
  })
  username: string;

  @Column({
    type: 'nvarchar',
  })
  password: string;

  @Column({
    type: 'nvarchar',
    length: 50,
    unique: true,
  })
  email: string;

  @Column({
    type: 'nvarchar',
    default: Roles.USER,
  })
  role: Roles;

  // @OneToMany(() => Order, order => order.user)
  // orders: Order[]

  // orderId column will be created here
  // @OneToOne(() => Order, order => order.user)
  // @JoinColumn()
  // order: Order

  // this is genrating a new table with userId and orderId
  // @ManyToMany(() => Order, (order) => order.users)
  // @JoinTable()
  // orders: Order[];
}
