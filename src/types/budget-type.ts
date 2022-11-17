import { projectResponse } from './project-type';
import { budgetItemGetResponse } from './budget-items-type';
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

export type budgetResponse = {
     uuid: string,
    initial_quantity: number | null,
    initial_cost: number | null,
    initial_total: number,
    spent_quantity: number | null,
    spent_total: number,
    to_spend_quantity: number | null,
    to_spend_cost:number | null,
    to_spend_total: number,
    updated_budget: number,
    budget_item: budgetItemGetResponse,
    project: projectResponse
}