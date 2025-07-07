import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { AccountBookCategory } from './AccountBookCategory';
import { AccountBookCategoryType } from '../models/AccountBookCategoryType';

@Entity('account_book')
export class AccountBook extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  amount: number;

  @Column()
  memo: string;

  @Column({ name: 'type' })
  type: AccountBookCategoryType;

  @Column({ name: 'is_regular_expenditure' })
  isRegularExpenditure: boolean;

  @Column({ name: 'is_disabled_budget' })
  isDisabledBudget: boolean;


  @Column({ name: 'register_date_time' })
  registerDateTime: Date;

  @Column({ type: 'time without time zone', nullable: true })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'time without time zone', nullable: true })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'account_book_category_id' })
  accountBookCategoryId: number;

  @ManyToOne((type) => AccountBookCategory)
  @JoinColumn({ name: 'account_book_category_id' })
  accountBookCategory: AccountBookCategory;
}
