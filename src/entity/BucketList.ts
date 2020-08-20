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
import {Todo} from "./Todo";

@Entity('bucket_list')
export class BucketList extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({name: 'complete_date'})
    completeDate: Date;

    @Column({name: 'thumb_image_url'})
    thumbImageUrl: string;

    @Column({name: 'image_url'})
    imageUrl: string;

    @Column({name: 'user_id'})
    userId: number;

    @ManyToOne(type => User)
    @JoinColumn({ name: 'user_id'})
    user: User;

    @OneToMany(type => Todo, todo => todo.bucketList )
    @JoinColumn({name: 'id'})
    todoList: Todo[];


    @Column({ type: "time without time zone", nullable: true })
    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @Column({ type: "time without time zone", nullable: true })
    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

}
