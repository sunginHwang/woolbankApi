import {
    Entity,
    PrimaryGeneratedColumn,
    BaseEntity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
    OneToMany
} from "typeorm";
import {User} from "./User";
import {SavingType} from "./SavingType";
import {Deposit} from "./Deposit";

@Entity('account')
export class Account extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({name: 'tax_type'})
    taxType: string;

    @Column({name: 'regular_transfer_date'})
    regularTransferDate: string;

    @Column()
    rate: number;

    @Column()
    amount: number;

    @Column({name: 'user_id'})
    userId: number;

    @OneToOne(type => User)
    @JoinColumn({ name: 'user_id'})
    user: User;

    @OneToMany(type => Deposit, deposit => deposit.account )
    @JoinColumn({name: 'id'})
    deposits: Deposit[];

    @OneToOne(type => SavingType)
    @JoinColumn({ name: 'saving_type_id'})
    savingType: SavingType;

    @Column('timestampz')
    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @Column('timestamptz')
    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

}