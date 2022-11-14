import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryColumn, Relation } from "typeorm";
import { Company } from "./companies-entity";
import { User } from "./users-entity";

@Entity()
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

    @ManyToOne(() => BudgetItem, (BudgetItem) => BudgetItem.childs)
    parent: Relation<BudgetItem>

    @ManyToOne(() => Company, (company) => company.budgetItems)
    company: Relation<Company>

    @ManyToOne(() => User, (user) => user.budgetItems)
    user: Relation<User>
}