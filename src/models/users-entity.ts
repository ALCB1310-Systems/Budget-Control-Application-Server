import { Entity, Column, PrimaryColumn, Unique, BaseEntity, ManyToOne, CreateDateColumn } from 'typeorm'
import { Company } from './companies-entity';

@Entity()
@Unique(["email"])
export class User extends BaseEntity{
    @PrimaryColumn({
        type: "uuid"
    })
    uuid: string

    @ManyToOne(() => Company, (company) => company.users)
    company: Company

    @Column({
        type: 'character varying',
        length: 255
    })
    email: string

    @Column({
        type: "char",
        length: 70
    })
    password: string

    @Column({
        type: 'character varying',
        length: 255
    })
    name: string

    @CreateDateColumn()
    created_at: Date
}