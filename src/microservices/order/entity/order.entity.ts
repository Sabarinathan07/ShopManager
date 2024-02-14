import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinTable,
} from 'typeorm';
import { Item } from '../../item/entity/item.entity';
import { User } from '../../user/entity/user.entity';

@Entity()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    quantity: number;

    @Column()
    amount: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    transactionDate: Date;

    @ManyToOne(() => User, (user) => user.id)
    customer: User;

    @ManyToOne(() => Item, (item) => item.orders, {
        // cascade: true,
    })
    // @JoinTable()
    item: Item;
}
