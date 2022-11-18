import { formatOneBudgetResponse } from './../helpers/format';
import { getOneBudgetItem } from './budget-items-controller';
import { errorType, successType } from './../types/responses-types';
import { Budget } from './../models/budget-entity';
import { budgetCreate, budgetUpdate } from './../types/budget-type';
import { Repository, QueryRunner, SelectQueryBuilder, CannotAttachTreeChildrenEntityError } from 'typeorm';
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

export const updateBudget = async (updatedInfo: budgetUpdate, budgetToUpdate: Budget, companyUUID: string): Promise<errorType | successType> => {
    const diff = updatedInfo.total - budgetToUpdate.to_spend_total
    debug("Diff", diff)

    try {
        await queryRunner.startTransaction()

        budgetToUpdate.to_spend_quantity = updatedInfo.quantity
        budgetToUpdate.to_spend_cost = updatedInfo.cost
        budgetToUpdate.to_spend_total = diff + budgetToUpdate.to_spend_total
        budgetToUpdate.updated_budget = budgetToUpdate.spent_total + budgetToUpdate.to_spend_total

        queryRunner.manager.save(budgetToUpdate)

        if (budgetToUpdate.budgetItem.parent){
            const nextBudget = await getBudgetByItemAndProject(budgetToUpdate.budgetItem.parent.uuid, budgetToUpdate.project.uuid, companyUUID)
            if (!nextBudget) throw new Error("No budget found for parent, check logs")

            await updateParentBudget(diff, nextBudget, companyUUID, queryRunner)
        }

        await queryRunner.commitTransaction()
        return { status: 200, detail: budgetToUpdate }
    } catch (error: any) {
        await queryRunner.rollbackTransaction()

        if (error.code === '23505') return {status: 409, detail: `Budget for item ${budgetToUpdate.budgetItem.name} in project ${budgetToUpdate.project.name} already exists`}

        console.error(error);
        return {status: 500, detail: "An error occurred, check your logs"}
    }
}

const updateParentBudget = async (diff: number, budget: Budget, companyUUID: string, queryRunner: QueryRunner): Promise<void> => {
    try {
        budget.to_spend_total += diff
        budget.updated_budget = budget.spent_total + budget.to_spend_total

        queryRunner.manager.save(budget)

        if (budget.budgetItem.parent){
            debug(budget.budgetItem.parent)
            const nextBudget = await getBudgetByItemAndProject(budget.budgetItem.parent.uuid, budget.project.uuid, companyUUID)
            if (!nextBudget) throw new Error("No budget found for parent, check logs")

            await updateParentBudget(diff, nextBudget, companyUUID, queryRunner)
        }
    } catch (error: any) {
        console.error(error)
        throw new Error(error)
    }
}

export const getOneBudgetWithBudgetResponse = async (budgetUUID:string, companyUUID:string): Promise<Budget | null> => {
    let budget: Budget | null = await budgetRepository
        .createQueryBuilder("budget")
        .leftJoinAndSelect("budget.project", "project")
        .leftJoinAndSelect("budget.budgetItem", "budgetItem")
        .leftJoinAndSelect("budgetItem.parent", "parent")
        .leftJoinAndSelect("budget.company", "company")
        .andWhere("budget.companyUuid = :company")
        .andWhere("budget.uuid = :uuid")
        .setParameter("company", companyUUID)
        .setParameter("uuid", budgetUUID)
        .getOne()

    return budget
}

const getBudgetByItemAndProject = async (budgetItemUUID: string, projectUUID: string, companyUUID: string): Promise <Budget | null> => {
    let budget: Budget | null = await budgetRepository
        .createQueryBuilder("budget")
        .leftJoinAndSelect("budget.project", "project")
        .leftJoinAndSelect("budget.budgetItem", "budgetItem")
        .leftJoinAndSelect("budgetItem.parent", "parent")
        .leftJoinAndSelect("budget.company", "company")
        .andWhere("budget.companyUuid = :company")
        .andWhere("budgetItem.uuid = :budgetItemUuid")
        .andWhere("project.uuid = :project")
        .setParameter("company", companyUUID)
        .setParameter("budgetItemUuid", budgetItemUUID)
        .setParameter("project", projectUUID)
        .getOne()

    return budget
}