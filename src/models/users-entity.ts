import { Entity, Column, PrimaryColumn, Unique, BaseEntity, ManyToOne, CreateDateColumn, Relation, OneToMany } from 'typeorm'
import { Budget } from './budget-entity';
import { BudgetItem } from './budget-items-entity';
import { Company } from './companies-entity';
import { Invoice } from './invoce-entity';
import { InvoiceDetail } from './invoice-details-entity';
import { Project } from './projects-entity';
import { Supplier } from './suppliers-entity';

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

    @OneToMany(() => Supplier, (supplier) => supplier.user)
    suppliers: Supplier[]

    @OneToMany(() => Project, (project) => project.user)
    projects: Project[]

    @OneToMany(() => BudgetItem, (budgetItem) => budgetItem.user)
    budgetItems: BudgetItem[]

    @OneToMany(() => Budget, (budget) => budget.user)
    budgets: Budget[]

    @OneToMany(() => Invoice, (invoice) => invoice.user)
    invoices: Invoice[]

    @OneToMany(() => InvoiceDetail, (invoiceDetail) => invoiceDetail.user)
    invoiceDetails: InvoiceDetail[]
}