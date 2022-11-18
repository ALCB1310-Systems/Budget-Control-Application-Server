import { Company } from './companies-entity';
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, Relation, Unique } from "typeorm";
import { User } from './users-entity';
import { Project } from './projects-entity';
import { Supplier } from './suppliers-entity';

@Entity()
@Unique(["company", "supplier", "invoice_number"])
export class Invoice extends BaseEntity {
    @PrimaryColumn({
        type: "uuid"
    })
    uuid: string

    @ManyToOne(() => Company, (company) => company.invoices)
    company: Relation<Company>

    @ManyToOne(() => User, (user) => user.invoices)
    user: Relation<User>

    @ManyToOne(() => Project, (project) => project.invoices)
    project: Relation<Project>

    @ManyToOne(() => Supplier, (supplier) => supplier.invoices)
    supplier: Relation<Supplier>

    @Column({
        type: 'character varying',
        length: 255
    })
    invoice_number: string

    @Column({
        type: 'date'
    })
    date: Date

    @Column({
        type: 'float'
    })
    total: number

    @CreateDateColumn({
        type: 'timestamptz'
    })
    created_at: Date
}