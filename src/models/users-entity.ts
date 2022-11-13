import { Entity, Column, PrimaryColumn, Unique, BaseEntity, ManyToOne, CreateDateColumn, Relation } from 'typeorm'
import { Company } from './companies-entity';

@Entity()
@Unique(["email"])
export class User extends BaseEntity{
    @PrimaryColumn({
        type: "uuid"
    })
    uuid: string

    @ManyToOne(() => Company, (company) => company.users)
    company: Relation<Company>

    @Column({
        type: 'character varying',
        length: 255
    })
    email: string

    @Column({
        type: 'character varying',
        length: 70
    })
    password: string

    @Column({
        type: 'character varying',
        length: 255
    })
    name: string

    @CreateDateColumn({
        type: 'timestamptz'
    })
    created_at: Date
}