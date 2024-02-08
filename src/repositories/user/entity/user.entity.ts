import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
} from 'typeorm';
import { Order } from '../../order/entity/order.entity';
import { Role } from '../enums/Role';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ type: 'enum', enum: Role, default: Role.customer })
    role: Role; // 'Customer' or 'Shopkeeper'

    @Column({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    date: Date;

    @OneToMany(() => Order, (order) => order.customer)
    orders: Order[];
}
