import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
    JoinColumn,
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

    @Column({ name: 'team_id', nullable: true })
    team_id: Team;

    @ManyToOne(() => Team, (team) => team.users)
    @JoinColumn({ name: 'team_id' })
    team: Team;

    @OneToMany(() => Order, (order) => order.customer)
    orders: Order[];
}
