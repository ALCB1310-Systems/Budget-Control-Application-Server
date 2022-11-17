import { formatOneBudgetResponse } from './../helpers/format';
import { getOneBudgetItem } from './budget-items-controller';
import { errorType, successType } from './../types/responses-types';
import { getOneProject } from './project-controller';
import { Budget } from './../models/budget-entity';
import { budgetCreate } from './../types/budget-type';
import { Repository, QueryRunner, SelectQueryBuilder } from 'typeorm';
import { AppDataSource } from "../db/data-source";
import { v4 } from 'uuid';
import { debug } from 'console';

const budgetRepository: Repository<Budget> = AppDataSource.getRepository(Budget)
const queryRunner: QueryRunner = AppDataSource.createQueryRunner()

export const createNewBudget = async (newBudget: budgetCreate): Promise<errorType | successType> => {
    try {
        await queryRunner.startTransaction()

        const budget = new Budget()

        budget.uuid = v4()
        budget.user = newBudget.user
        budget.company = newBudget.company
        budget.project = newBudget.project
        budget.budgetItem = newBudget.budgetItem
        budget.initial_total = newBudget.total
        budget.spent_total = 0
        budget.to_spend_total = newBudget.total
        budget.updated_budget = newBudget.total

        budget.initial_quantity = newBudget.quantity
        budget.initial_cost = newBudget.cost
        budget.spent_quantity = 0
        budget.to_spend_quantity = newBudget.quantity
        budget.to_spend_cost = newBudget.cost

        await queryRunner.manager.save(budget)

        if (newBudget.budgetItem.parent){
            const budgetItem = await getOneBudgetItem(newBudget.budgetItem.parent.uuid, newBudget.company.uuid)
            if (!budgetItem) throw new Error("Unknown project")

            newBudget.budgetItem = budgetItem.detail

            await saveNewBudget(newBudget, queryRunner)
        }
        
        await queryRunner.commitTransaction()
        
        return {status: 201, detail: budget}
    } catch (error: any) {
        await queryRunner.rollbackTransaction()

        if (error.code === '23505') return {status: 409, detail: `Budget for item ${newBudget.budgetItem.name} in project ${newBudget.project.name} already exists`}

        console.error(error);
        return {status: 500, detail: "An error occurred, check your logs"}
    }
}

const saveNewBudget = async(newBudget: budgetCreate, queryRunner: QueryRunner)=> {

    try{
        const budgetToCreate = await budgetExists(newBudget, false)


        if (!budgetToCreate){
            // need to create the budget
            const budget = new Budget()

            budget.uuid = v4()
            budget.user = newBudget.user
            budget.company = newBudget.company
            budget.project = newBudget.project
            budget.budgetItem = newBudget.budgetItem
            budget.initial_total = newBudget.total
            budget.spent_total = 0
            budget.to_spend_total = newBudget.total
            budget.updated_budget = newBudget.total

            await queryRunner.manager.save(budget)
        } else 
        {
            // need to update the budget
            budgetToCreate.initial_total += newBudget.total
            budgetToCreate.to_spend_total += newBudget.total
            budgetToCreate.updated_budget += newBudget.total

            await queryRunner.manager.save(budgetToCreate)
        }

        if (newBudget.budgetItem.parent){
            const budgetItem = await getOneBudgetItem(newBudget.budgetItem.parent.uuid, newBudget.company.uuid)
            if (!budgetItem) throw new Error("Unknown project")

            newBudget.budgetItem = budgetItem.detail

            saveNewBudget(newBudget, queryRunner)
        }
    } catch (error: any){
        console.error(error)
        
        throw new Error(error);
    }
}

const budgetExists = async (budgetData: budgetCreate, deb: boolean): Promise<Budget | null> => {

    const budget = await budgetRepository
        .createQueryBuilder("budget")
        .andWhere("budget.companyUuid = :company")
        .andWhere("budget.projectUuid = :project")
        .andWhere("budget.budgetItemUuid = :budgetItem")
        .setParameter("company", budgetData.company.uuid)
        .setParameter("project", budgetData.project.uuid)
        .setParameter("budgetItem", budgetData.budgetItem.uuid)
        .getOne()

    return budget
}

export const getAllBudgets = async (companyUUID: string, projectUUID: string | null = null): Promise<Budget[]> => {
    let budgets: SelectQueryBuilder<Budget> = budgetRepository
        .createQueryBuilder("budget")
        .leftJoinAndSelect("budget.project", "project")
        .leftJoinAndSelect("budget.budgetItem", "budgetItem")
        .leftJoinAndSelect("budgetItem.parent", "parent")
        .andWhere("budget.companyUuid = :company")
        .setParameter("company", companyUUID)

    if (projectUUID){
        budgets = budgets.andWhere("budget.projectUuid = :project")
            .setParameter("project",projectUUID)
    }

    const budgetsResults: Budget[] = await budgets
        .addOrderBy("project.name")
        .addOrderBy("budgetItem.code")
        .getMany()

    return budgetsResults
}

export const getOneBudget = async (budgetUUID: string, companyUUID: string): Promise<errorType | successType> => {
    let budget: Budget | null = await budgetRepository
        .createQueryBuilder("budget")
        .leftJoinAndSelect("budget.project", "project")
        .leftJoinAndSelect("budget.budgetItem", "budgetItem")
        .leftJoinAndSelect("budgetItem.parent", "parent")
        .andWhere("budget.companyUuid = :company")
        .andWhere("budget.uuid = :uuid")
        .setParameter("company", companyUUID)
        .setParameter("uuid", budgetUUID)
        .getOne()

    if (!budget) return {status: 404, detail: `Budget with uuid ${budgetUUID} does not exist`}

    return {status: 200, detail: formatOneBudgetResponse(budget)}
}