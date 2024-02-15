import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
} from 'typeorm';
import { Order } from '../../order/entity/';
import { Role } from '../enums/';
import { Team } from 'src/microservices/team/entity/team.entity';

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

    @Column({ default: false })
    teamadmin: boolean;

    @ManyToOne(() => Team, (team) => team.users)
    team: Team;

    @OneToMany(() => Order, (order) => order.customer)
    orders: Order[];
}
