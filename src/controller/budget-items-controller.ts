import { formatOneBudgetItemResponse } from './../helpers/format';
import { errorType, successType } from './../types/responses-types';
import { QueryRunner, Repository } from 'typeorm';
import { v4 } from 'uuid';
import { AppDataSource } from '../db/data-source';
import { BudgetItem } from '../models/budget-items-entity';
import { Company } from '../models/companies-entity';
import { User } from '../models/users-entity';
import { budgetItemCreate } from './../types/budget-items-type';

const budgetItemRepository: Repository<BudgetItem> = AppDataSource.getRepository(BudgetItem)
const queryRunner: QueryRunner = AppDataSource.createQueryRunner()

export const createBudgetItem = async (newBudgetItem: budgetItemCreate, company: Company, user: User): Promise<errorType | successType> => {
    const budgetItem = new BudgetItem()

    budgetItem.uuid = v4()
    budgetItem.code = newBudgetItem.code
    budgetItem.name = newBudgetItem.name
    budgetItem.accumulates = newBudgetItem.accumulates
    budgetItem.level = newBudgetItem.level
    budgetItem.parent = newBudgetItem ? await getOneBudgetItem(newBudgetItem.parentUuid, company.uuid) :  null
    budgetItem.company = company
    budgetItem.user = user

    try {
        await queryRunner.startTransaction()
        await queryRunner.manager.save(budgetItem)
        await queryRunner.commitTransaction()

        return {status: 201, detail: formatOneBudgetItemResponse(budgetItem)}
    } catch (error: any) {
        await queryRunner.rollbackTransaction()
         if (error.code !== undefined && error.code === '23505') return { status: 409, detail: `Budget item with code: "${newBudgetItem.code}" or name: "${newBudgetItem.name}" already exists`}

         console.error(error)
         return {status: 500, detail: `Unknown error, please check the logs`}
    }
}


export const getOneBudgetItem = async (parentUUID: string, company: string): Promise<BudgetItem | null> => {
    const budgetItem = await budgetItemRepository
        .createQueryBuilder("budgetItem")
        .select("*")
        .andWhere("budgetItem.uuid = :uuid")
        .andWhere("budgetItem.companyUuid: companyUuid")
        .setParameter("uuid", parentUUID)
        .setParameter("companyUuid", company)
        .getOne()

    return budgetItem
}