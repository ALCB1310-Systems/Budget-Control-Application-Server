import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn, Relation, CreateDateColumn, Unique } from "typeorm";
import { BudgetItem } from "./budget-items-entity";
import { Company } from "./companies-entity";
import { Project } from "./projects-entity";
import { User } from "./users-entity";

@Entity()
@Unique(["company", "budgetItem", "project"])
export class Budget extends BaseEntity {
    @PrimaryColumn({
        type: "uuid"
    })
    uuid: string

    @ManyToOne(() => User, (user) => user.budgets)
    user: Relation<User>

    @ManyToOne(() => Company, (company) => company.budgets)
    company: Relation<Company>

    @ManyToOne(() => BudgetItem, (budgetItem) => budgetItem.budgets)
    budgetItem: Relation<BudgetItem>

    @ManyToOne(() => Project, (project) => project.budgets)
    project: Relation<Project>

    @Column({
        type: "float",
        nullable: true
    })
    initial_quantity: number | null

    @Column({
        type: "float",
        nullable: true
    })
    initial_cost: number | null

    @Column({
        type: "float"
    })
    initial_total: number

    @Column({
        type: "float",
        nullable: true
    })
    spent_quantity: number | null

    @Column({
        type: "float"
    })
    spent_total: number

    @Column({
        type: "float",
        nullable: true
    })
    to_spend_quantity: number | null

    @Column({
        type: "float",
        nullable: true
    })
    to_spend_cost: number | null

    @Column({
        type: "float"
    })
    to_spend_total: number

    @Column({
        type: "float"
    })
    updated_budget: number

    @CreateDateColumn({
        type: 'timestamptz'
    })
    created_at: Date
}