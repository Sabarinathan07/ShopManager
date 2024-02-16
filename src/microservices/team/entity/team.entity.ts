import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';

@Entity()
export class Team {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    // @Column({ name: 'admin_id', nullable: true })
    // adminId: string;

    @ManyToOne(() => User, (user) => user.team)
    admin: User;

    @OneToMany(() => User, (user) => user.team)
    users: User[];
}

// import { User } from 'src/microservices/user';
// import {
//     Column,
//     Entity,
//     JoinColumn,
//     ManyToOne,
//     OneToOne,
//     PrimaryGeneratedColumn,
// } from 'typeorm';

// @Entity()
// export class Team {
//     @PrimaryGeneratedColumn('uuid')
//     id: string;

//     @Column()
//     name: string;

//     @Column({ name: 'user_id', nullable: true })
//     userId: string;

//     // @Column('text', {
//     //     name: 'users_id',
//     //     array: true,
//     //     default: [],
//     //     nullable: true,
//     // })
//     // users_id: string[];

//     @OneToOne(() => User, (user) => user.id)
//     @JoinColumn({ name: 'user_id' })
//     admin: User;

//     // @OneToMany(() => User, (user) => user.team, { cascade: true })
//     // @JoinColumn({ name: 'users_id' })
//     // members: User[] | null;
// }
