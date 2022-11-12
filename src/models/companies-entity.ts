import { Entity, Column, PrimaryColumn, Unique, BaseEntity, OneToMany, CreateDateColumn } from 'typeorm'
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

    @OneToMany(() => User, (user) => user.company)
    users: User[]
    
    @CreateDateColumn()
    created_at: Date
}