import { Entity, Column, PrimaryColumn, Unique, BaseEntity, OneToMany, CreateDateColumn } from 'typeorm'
import { BudgetItem } from './budget-items-entity';
import { Project } from './projects-entity';
import { Supplier } from './suppliers-entity';
import { User } from './users-entity'

@Entity()
@Unique(["name"])
@Unique(["ruc"])
export class Company extends BaseEntity {
    @PrimaryColumn({
        type: 'uuid'
    })
    uuid: string

    @Column()
    ruc: string

    @Column()
    name: string

    @Column({ type: "int"})
    employees: number
    
    @CreateDateColumn({
        type: 'timestamptz'
    })
    created_at: Date
    
    @OneToMany(() => User, (user) => user.company)
    users: User[]

    @OneToMany(() => Supplier, (supplier) => supplier.company)
    suppliers: Supplier[]

    @OneToMany(() => Project, (project) => project.company)
    projects: Project[]

    @OneToMany(() => BudgetItem, (budgetItem) => budgetItem.company)
    budgetItems: BudgetItem[]
}