import {
    Entity,
    PrimaryGeneratedColumn,
    BaseEntity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import {User} from "./User";
import {AccountBookCategory} from "./AccountBookCategory";

@Entity('regular_expenditure')
export class RegularExpenditure extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    amount: number;

    @Column({name: 'regular_date'})
    regularDate: number;

    @Column({name: 'installment_months'})
    installmentMonths: number;

    @Column({name: 'is_auto_expenditure'})
    isAutoExpenditure: boolean;

    @Column({name: 'paid_installment_months'})
    paidInstallmentMonths: number;

    @Column({name: 'user_id'})
    userId: number;

    @ManyToOne(type => User)
    @JoinColumn({ name: 'user_id'})
    user: User;

    @Column({ name: 'account_book_category_id' })
    accountBookCategoryId: number;

    @ManyToOne((type) => AccountBookCategory)
    @JoinColumn({ name: 'account_book_category_id' })
    accountBookCategory: AccountBookCategory;


    @Column({ type: "time without time zone", nullable: true })
    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @Column({ type: "time without time zone", nullable: true })
    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

}
