import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn, Relation, Unique } from "typeorm";
import { Budget } from "./budget-entity";
import { Company } from "./companies-entity";
import { User } from "./users-entity";

@Entity()
@Unique(["company", "code"])
@Unique(["company", "name"])
export class BudgetItem extends BaseEntity{
    @PrimaryColumn({
        type: "uuid"
    })
    uuid: string

    @Column({
        type: "character varying",
        length: 50
    })
    code: string

    @Column({
        type: "character varying",
        length: 255
    })
    name: string

    @Column({
        type: "boolean"
    })
    accumulates: boolean

    @Column({
        type: "int"
    })
    level: number

    @OneToMany(() => BudgetItem, (budgetItem) => budgetItem.parent)
    childs: BudgetItem[]

    @ManyToOne(() => BudgetItem, (BudgetItem) => BudgetItem.childs, { nullable: true })
    parent: Relation<BudgetItem> | null

    @ManyToOne(() => Company, (company) => company.budgetItems, { nullable: false })
    company: Company

    @ManyToOne(() => User, (user) => user.budgetItems, { nullable: false })
    user: Relation<User>

    @CreateDateColumn({
        type: 'timestamptz'
    })
    created_at: Date

    @OneToMany(() => Budget, (budget) => budget.budgetItem)
    budgets: Budget[]
}