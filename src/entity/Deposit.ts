import {
    Entity,
    PrimaryGeneratedColumn,
    BaseEntity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    ManyToOne,
} from "typeorm";
import {User} from "./User";
import {Account} from "./Account";

@Entity('deposit')
export class Deposit extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    amount: number;

    @Column({name: 'prev_total_amount'})
    prevTotalAmount: number;

    @Column({name: 'user_id'})
    userId: number;

    @ManyToOne(type => User)
    @JoinColumn({name: 'user_id'})
    user: User

    @Column({name: 'account_id'})
    accountId: number;

    @ManyToOne(type => Account)
    @JoinColumn({name: 'account_id'})
    account: Account

    @Column({name: 'deposit_date'})
    depositDate: Date;

    @Column('timestampz')
    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @Column('timestamptz')
    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;
}
