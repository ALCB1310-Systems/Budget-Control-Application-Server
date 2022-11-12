import { Entity, Column, PrimaryColumn, Unique, BaseEntity, ManyToOne } from 'typeorm'
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

    @Column()
    email: string

    @Column()
    password: string

    @Column()
    name: string
}