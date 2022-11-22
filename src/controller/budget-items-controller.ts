import { getCompany } from './companies-controller';
import { formatManyBudgetItemsResponse, formatOneBudgetItemResponse } from './../helpers/format';
import { errorType, successType } from './../types/responses-types';
import { QueryRunner, Repository } from 'typeorm';
import { v4 } from 'uuid';
import { AppDataSource } from '../db/data-source';
import { BudgetItem } from '../models/budget-items-entity';
import { Company } from '../models/companies-entity';
import { User } from '../models/users-entity';
import { budgetItemCreate, budgetItemGetResponse } from './../types/budget-items-type';

const budgetItemRepository: Repository<BudgetItem> = AppDataSource.getRepository(BudgetItem)
const queryRunner: QueryRunner = AppDataSource.createQueryRunner()

export const createBudgetItem = async (newBudgetItem: budgetItemCreate, company: Company, user: User): Promise<errorType | successType> => {
    const budgetItem = new BudgetItem()

    budgetItem.uuid = v4()
    budgetItem.code = newBudgetItem.code
    budgetItem.name = newBudgetItem.name
    budgetItem.accumulates = newBudgetItem.accumulates
    budgetItem.level = newBudgetItem.level
    budgetItem.parent = newBudgetItem.parentUuid ? await getParentBudgetItem(newBudgetItem.parentUuid, company) :  null
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

export const getAllBudgetItems = async (companyUuid: string): Promise<budgetItemGetResponse[]> => {
    const company = await getCompany(companyUuid)
    if (!company) throw new Error("couldn't get the company")
    const budgetItems = await budgetItemRepository
        .createQueryBuilder("budgetItem")
        .leftJoinAndSelect("budgetItem.parent", "parent")
        .andWhere("budgetItem.companyUuid = :companyUuid")
        .setParameter("companyUuid", companyUuid)
        .getMany()

    const formattedBudgetItems = formatManyBudgetItemsResponse(budgetItems)

    return formattedBudgetItems
}

export const getOneBudgetItem = async (budgetItemUuid: string, companyUuid: string): Promise<errorType | successType> => {
    const company = await getCompany(companyUuid)
    if (!company) throw new Error("couldn't get the company")
    const budgetItem = await budgetItemRepository
        .createQueryBuilder("budgetItem")
        .leftJoinAndSelect("budgetItem.parent", "parent")
        .andWhere("budgetItem.companyUuid = :companyUuid")
        .andWhere("budgetItem.uuid = :budgetItemUuid")
        .setParameter("companyUuid", companyUuid)
        .setParameter("budgetItemUuid", budgetItemUuid)
        .getOne()

    if (!budgetItem) return {status: 404, detail: `No budget item with uuid: ${budgetItemUuid}`}

    return { status: 200, detail: budgetItem }
}

export const getOneBudgetItemWithBudgetItemResponse = async (budgetItemUuid: string, companyUuid: string): Promise<BudgetItem | null> => {
    const company = await getCompany(companyUuid)
    if (!company) throw new Error("couldn't get the company")
    const budgetItem = await budgetItemRepository
        .createQueryBuilder("budgetItem")
        .leftJoinAndSelect("budgetItem.parent", "parent")
        .andWhere("budgetItem.companyUuid = :companyUuid")
        .andWhere("budgetItem.uuid = :budgetItemUuid")
        .setParameter("companyUuid", companyUuid)
        .setParameter("budgetItemUuid", budgetItemUuid)
        .getOne()

    return budgetItem
}

const getParentBudgetItem = async (parentUUID: string, company: Company): Promise<BudgetItem | null> => {
    const budgetItem = await budgetItemRepository
        .createQueryBuilder("budgetItem")
        .select("budgetItem.uuid")
        .addSelect("budgetItem.code")
        .addSelect("budgetItem.name")
        .addSelect("budgetItem.accumulates")
        .addSelect("budgetItem.level")
        .addSelect("budgetItem.parentUuid")
        .andWhere("budgetItem.uuid = :uuid")
        .andWhere("budgetItem.companyUuid = :companyUuid")
        .setParameter("uuid", parentUUID)
        .setParameter("companyUuid", company.uuid)
        .getOne()
    
    return budgetItem
}

export const updateBudgetItem = async (updatedBudgetItemInformation: budgetItemCreate, budgetItemToUpdate: BudgetItem, company: Company): Promise<errorType|successType> => {
    budgetItemToUpdate.code = updatedBudgetItemInformation.code ? updatedBudgetItemInformation.code : budgetItemToUpdate.code
    budgetItemToUpdate.name = updatedBudgetItemInformation.name ? updatedBudgetItemInformation.name : budgetItemToUpdate.name
    budgetItemToUpdate.accumulates = updatedBudgetItemInformation.accumulates === undefined ? updatedBudgetItemInformation.accumulates : budgetItemToUpdate.accumulates
    budgetItemToUpdate.level = updatedBudgetItemInformation.level ? updatedBudgetItemInformation.level : budgetItemToUpdate.level
    const parentBudget = updatedBudgetItemInformation.parentUuid ? await getParentBudgetItem(updatedBudgetItemInformation.parentUuid, company) : budgetItemToUpdate.parent

    budgetItemToUpdate.parent = parentBudget

    try {
        await queryRunner.startTransaction()
        await queryRunner.manager.save(budgetItemToUpdate)
        await queryRunner.commitTransaction()

        return {status: 200, detail: formatOneBudgetItemResponse(budgetItemToUpdate)}
    } catch (error: any) {
        await queryRunner.rollbackTransaction()
         if (error.code !== undefined && error.code === '23505') return { status: 409, detail: `Budget item with code: "${budgetItemToUpdate.code}" or name: "${budgetItemToUpdate.name}" already exists`}

         console.error(error)
         return {status: 500, detail: `Unknown error, please check the logs`}
    }
}