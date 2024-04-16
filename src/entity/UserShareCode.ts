import {
    Entity,
    PrimaryGeneratedColumn,
    BaseEntity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity('user_share_code')
export class UserShareCode extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'user_id'})
    userId: number;


    @Column({name: 'share_code'})
    shareCode: string;


    @Column({ type: "time without time zone", nullable: true })
    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @Column({ type: "time without time zone", nullable: true })
    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

}
