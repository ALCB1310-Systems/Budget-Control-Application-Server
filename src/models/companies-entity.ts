import { Entity, Column, PrimaryColumn, Unique, BaseEntity } from 'typeorm'

@Entity()
@Unique(["name"])
@Unique(["ruc"])
export class Company extends BaseEntity {
    @PrimaryColumn()
    uuid: string

    @Column()
    ruc: string

    @Column()
    name: string

    @Column({ type: "int"})
    employees: number
    
    // constructor(ruc: string, name: string, employees: number) {
    //     this.uuid = v4()
    //     this.ruc = ruc
    //     this.name = name
    //     this.employees = employees
    // }
}