import {Entity, PrimaryGeneratedColumn, BaseEntity, Column, CreateDateColumn, UpdateDateColumn} from "typeorm";

@Entity('expenditure_type')
export class ExpenditureType extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @Column()
    name: string;

    @Column('timestampz')
    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @Column('timestamptz')
    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;
}
