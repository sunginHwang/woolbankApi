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
import {BucketList} from "./BucketList";

@Entity('todo')
export class Todo extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({name: 'is_complete'})
    isComplete: boolean;

    @Column({name: 'user_id'})
    userId: number;

    @ManyToOne(type => User)
    @JoinColumn({ name: 'user_id'})
    user: User;

    @Column({name: 'bucket_list_id'})
    bucketListId: number;

    @ManyToOne(type => BucketList)
    @JoinColumn({name: 'bucket_list_id'})
    bucketList: BucketList

    @Column({ type: "time without time zone", nullable: true })
    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @Column({ type: "time without time zone", nullable: true })
    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

}
