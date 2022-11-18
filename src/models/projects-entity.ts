import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn, Relation, Unique } from "typeorm";
import { Budget } from "./budget-entity";
import { Company } from "./companies-entity";
import { User } from "./users-entity";

@Entity()
@Unique(["company", "name"])
export class Project extends BaseEntity {
    @PrimaryColumn({
        type: "uuid"
    })
    uuid: string

    @Column({
        type: "character varying",
        length: 255
    })
    name: string

    @Column({
        type: "boolean"
    })
    is_active: boolean

    @ManyToOne(() => Company, (company) => company.projects)
    company: Relation<Company>

    @ManyToOne(() => User, (user) => user.projects)
    user: Relation<User>

    @CreateDateColumn({
        type: 'timestamptz'
    })
    created_at: Date

    @OneToMany(() => Budget, (budget) => budget.project)
    budgets: Budget[]
}