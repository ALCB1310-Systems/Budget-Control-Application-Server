import { Project } from './../models/projects-entity';
import { BudgetItem } from './../models/budget-items-entity';
import { Company } from "../models/companies-entity";
import { User } from "../models/users-entity";

export type budgetCreate = {
    quantity: number,
    cost: number,
    total: number,
    user: User,
    company: Company,
    project: Project,
    budgetItem: BudgetItem
}