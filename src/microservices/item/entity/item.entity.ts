import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from '../../order/entity/';
import { User } from '../../user/entity/';

@Entity()
export class Item {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column('int')
    quantity: number;

    @Column()
    price: number;

    @ManyToOne(() => User, (user) => user.id)
    shopkeeper: User;

    @OneToMany(() => Order, (order) => order.item)
    orders: Order[];
}
