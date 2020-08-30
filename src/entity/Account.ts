import {
    Entity,
    PrimaryGeneratedColumn,
    BaseEntity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
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
    regularTransferDate: number;

    @Column()
    rate: number;

    @Column()
    amount: number;

    @Column()
    currentAmount: number;

    @Column({name: 'start_date'})
    startDate: Date;

    @Column({name: 'end_date'})
    endDate: Date;

    @Column({name: 'user_id'})
    userId: number;

    @ManyToOne(type => User)
    @JoinColumn({name: 'user_id'})
    user: User;

    @OneToMany(type => Deposit, deposit => deposit.account)
    @JoinColumn({name: 'id'})
    deposits: Deposit[];

    @Column({name: 'saving_type_id'})
    savingTypeId: number;

    @ManyToOne(type => SavingType)
    @JoinColumn({name: 'saving_type_id'})
    savingType: SavingType;

    @Column({type: "time without time zone", nullable: true})
    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @Column({type: "time without time zone", nullable: true})
    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

}
