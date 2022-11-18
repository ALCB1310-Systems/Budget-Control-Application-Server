import { User } from './users-entity';
import { Company } from './companies-entity';
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, Unique, Relation } from "typeorm";

@Entity()
@Unique(["supplier_id", "company"])
@Unique(["name", "company"])
export class Supplier extends BaseEntity{
    @PrimaryColumn({
        type: "uuid"
    })
    uuid: string

    @Column({
        type: "character varying",
        length: 255
    })
    supplier_id: string

    @Column({
        type: "character varying",
        length: 255
    })
    name: string

    @Column({
        type: "character varying",
        length: 255,
        nullable: true
    })
    contact_name: string | null

    @Column({
        type: "character varying",
        length: 255,
        nullable: true
    })
    contact_email: string | null

    @Column({
        type: "character varying",
        length: 255,
        nullable: true
    })
    contact_phone: string | null

    @CreateDateColumn({
        type: 'timestamptz'
    })
    created_at!: Date

    @ManyToOne(() => Company, (company) => company.suppliers)
    company: Relation<Company>

    @ManyToOne(() => User, (user) => user.suppliers)
    user: Relation<User>
}