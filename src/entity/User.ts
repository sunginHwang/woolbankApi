import {
    Entity,
    PrimaryGeneratedColumn,
    BaseEntity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity('user')
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({name: 'login_type'})
    loginType: string;

    @Column({name: 'profile_img'})
    profileImg: string;

    @Column('timestampz')
    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @Column('timestamptz')
    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;
}
