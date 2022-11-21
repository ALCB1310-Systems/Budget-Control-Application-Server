import { Budget } from './../models/budget-entity';
import { errorType, successType } from './../types/responses-types';
import { Invoice } from './../models/invoce-entity';
import { Repository, QueryRunner } from 'typeorm';
import { AppDataSource } from "../db/data-source";
import { InvoiceDetail } from "../models/invoice-details-entity";
import { invoiceDetailCreate } from '../types/invoice-details-type';
import { Company } from '../models/companies-entity';
import { User } from '../models/users-entity';
import { v4 } from 'uuid';
import { saveBudgetWithSpent, getBudgetByItemAndProject } from './budget-controller';

const invoiceDetailRepository: Repository<InvoiceDetail> = AppDataSource.getRepository(InvoiceDetail)
const queryRunner: QueryRunner = AppDataSource.createQueryRunner()

export const createInvoiceDetail = async (invoiceDetailData: invoiceDetailCreate, invoice: Invoice, company: Company, user: User, budget: Budget): Promise<errorType | successType> => {
    try {
        await queryRunner.startTransaction()
        const invoiceDetail = new InvoiceDetail()
        invoiceDetail.uuid = v4()
        invoiceDetail.company = company
        invoiceDetail.user = user
        invoiceDetail.invoice = invoice
        invoiceDetail.budgetItem = invoiceDetailData.budgetItem
        invoiceDetail.quantity = invoiceDetailData.quantity
        invoiceDetail.cost = invoiceDetailData.cost
        invoiceDetail.total = invoiceDetailData.total
        
        await queryRunner.manager.save(invoiceDetail)

        invoice.total += invoiceDetailData.total
        await queryRunner.manager.save(invoice)

        const previousUpdatedBudget = budget.updated_budget

        if (budget.spent_quantity === null || budget.to_spend_quantity === null)
            return {status: 400, detail: `The budget you are trying to update does not have a quantity`}

        budget.spent_quantity += invoiceDetailData.quantity
        budget.spent_total += invoiceDetailData.total
        budget.to_spend_cost = invoiceDetailData.cost
        budget.to_spend_quantity -= invoiceDetailData.quantity
        budget.to_spend_total = budget.to_spend_quantity * budget.to_spend_cost
        budget.updated_budget = budget.spent_total + budget.to_spend_total

        await queryRunner.manager.save(budget)

        const diff = budget.updated_budget - previousUpdatedBudget
        if (budget.budgetItem.parent){
            const nextBudget: Budget | null = await getBudgetByItemAndProject(budget.budgetItem.parent.uuid, budget.project.uuid, company.uuid)
            if(nextBudget)
                await saveBudgetWithSpent(invoiceDetailData.total, diff, nextBudget, queryRunner)
        }

        await queryRunner.commitTransaction()

        return {status: 201, detail: invoiceDetail}

    } catch (error: any) {
        await queryRunner.rollbackTransaction()

        if (error.code = '23505') return {status: 409, detail: `The invoice has already have the budget item ${invoiceDetailData.budgetItem.name}`}

        console.error(error)

        return { status: 500, detail: 'Something went wrong, please check your logs'}
    }
}