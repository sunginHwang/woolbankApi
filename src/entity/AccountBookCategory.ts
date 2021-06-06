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
import { User } from "./User";
import { AccountBookCategoryType } from "../models/AccountBookCategoryType";

@Entity('account_book_category')
export class AccountBookCategory extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({name: 'user_id'})
    userId: number;

    @Column({name: 'del_yn'})
    delYn: boolean;

    @Column({name: 'type'})
    type: AccountBookCategoryType;

    @ManyToOne(type => User)
    @JoinColumn({name: 'user_id'})
    user: User;

    @Column({type: "time without time zone", nullable: true})
    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @Column({type: "time without time zone", nullable: true})
    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

}
