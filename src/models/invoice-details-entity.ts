import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, Relation, Unique } from "typeorm";
import { BudgetItem } from "./budget-items-entity";
import { Company } from "./companies-entity";
import { Invoice } from "./invoce-entity";
import { User } from "./users-entity";

@Entity()
@Unique(["company", "invoice", "budgetItem"])
export class InvoiceDetail extends BaseEntity {
    @PrimaryColumn({
        type: "uuid"
    })
    uuid: string

    @ManyToOne(() => Company, (company) => company.invoiceDetails)
    company: Relation<Company>

    @ManyToOne(() => User, (user) => user.invoiceDetails)
    user: Relation<User>

    @ManyToOne(() => Invoice, (invoice) => invoice.invoiceDetails)
    invoice: Relation<Invoice>

    @ManyToOne(() => BudgetItem, (budgetItem) => budgetItem.invoiceDetails)
    budgetItem: Relation<BudgetItem>

    @Column({
        type: "float"
    })
    quantity: number

    @Column({
        type: "float"
    })
    cost: number

    @Column({
        type: "float"
    })
    total: number

    @CreateDateColumn({
        type: 'timestamptz'
    })
    created_at: Date
}