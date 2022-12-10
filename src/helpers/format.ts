import { invoiceResponse } from './../types/invoice-types';
import { Invoice } from './../models/invoce-entity';
import { Budget } from './../models/budget-entity';
import { budgetItemResponse, budgetItemGetResponse } from './../types/budget-items-type';
import { BudgetItem } from './../models/budget-items-entity';
import { projectResponse } from './../types/project-type';
import { supplierResponse } from './../types/supplier-type';
import { Supplier } from './../models/suppliers-entity';
import { userResponse } from './../types/users-type';
import { Company } from "../models/companies-entity";
import { User } from "../models/users-entity";
import { Project } from '../models/projects-entity';
import { budgetResponse } from '../types/budget-type';
import { InvoiceDetail } from '../models/invoice-details-entity';

export const formatManyUserResponse = (users: User[], company: Company): userResponse[] => {
    const formattedUser = users.map(user => {
        return formatOneUserResponse(user, company)
    })

    return formattedUser
}

export const formatOneUserResponse = (user: User, company: Company): userResponse => {
    return {
        uuid: user.uuid,
        email: user.email,
        name: user.name,
        company: company
    }
}

export const formatOneSupplierResponse = (supplier: Supplier): supplierResponse => {
    return {
        uuid: supplier.uuid,
        supplier_id: supplier.supplier_id,
        name: supplier.name,
        contact_name: supplier.contact_name,
        contact_email: supplier.contact_email,
        contact_phone: supplier.contact_phone
    }
}

export const formatOneProjectResponse = (project: Project): projectResponse => {
    return{
        uuid: project.uuid,
        name: project.name,
        is_active: project.is_active
    }
}

export const formatOneBudgetItemResponse = (budgetItem: BudgetItem): budgetItemResponse => {
    return {
        uuid: budgetItem.uuid,
        code: budgetItem.code,
        name: budgetItem.name,
        accumulates: budgetItem.accumulates,
        level: budgetItem.level,
        parentUuid: budgetItem.parent?.uuid
    }
}

export const formatGetOneBudgetItemResponse = (budgetItem: BudgetItem): budgetItemGetResponse => {

    let parent = null
    if (budgetItem.parent)
        parent =  {
                uuid: budgetItem.parent.uuid,
                code: budgetItem.parent.code,
                name: budgetItem.parent.name,
                accumulates: budgetItem.parent.accumulates,
                level: budgetItem.parent.level,
                parentUuid: null
            } 

    return {
        uuid: budgetItem.uuid,
        code: budgetItem.code,
        name: budgetItem.name,
        accumulates: budgetItem.accumulates,
        level: budgetItem.level,
        parent
    }
}

export const formatManyBudgetItemsResponse = (budgetItems: BudgetItem[]): budgetItemGetResponse[] => {
    const formattedBudgetItems = budgetItems.map( budgetItem => formatGetOneBudgetItemResponse(budgetItem))

    return formattedBudgetItems
}

export const formatManyBudgetResponse = (budgets: Budget[]): budgetResponse[] => {
    const formattedBudget = budgets.map(budget => formatOneBudgetResponse(budget))

    return formattedBudget
}

export const formatOneBudgetResponse = (budget: Budget): budgetResponse => {
    const budget_item: budgetItemGetResponse = formatGetOneBudgetItemResponse(budget.budgetItem)
    const project: projectResponse = formatOneProjectResponse(budget.project)

    const budgetResponse: budgetResponse = {
        uuid: budget.uuid,
        initial_quantity: budget.initial_quantity,
        initial_cost: budget.initial_cost,
        initial_total: budget.initial_total,
        spent_quantity: budget.spent_quantity,
        spent_total: budget.spent_total,
        to_spend_quantity: budget.to_spend_quantity,
        to_spend_cost: budget.to_spend_cost,
        to_spend_total: budget.to_spend_total,
        updated_budget: budget.updated_budget,
        budget_item,
        project
    }

    return budgetResponse
}

export const formatManyInvoicesResponse = (invoices: Invoice[]) => {
    return invoices.map(invoice => formatOneInvoiceResponse(invoice))
}

export const formatOneInvoiceResponse = (invoice: Invoice): invoiceResponse => {
    return {
        uuid: invoice.uuid,
        invoice_number: invoice.invoice_number,
        date: invoice.date,
        total: invoice.total,
        project: {
            uuid: invoice.project.uuid,
            name: invoice.project.name,
            active: invoice.project.is_active
        },
        supplier: {
            uuid: invoice.supplier.uuid,
            supplier_id: invoice.supplier.supplier_id,
            name: invoice.supplier.name,
            contact_name: invoice.supplier.contact_name,
            contact_email: invoice.supplier.contact_email,
            contact_phone: invoice.supplier.contact_phone
        }
    }
}

export const formatOneInvoiceDetailResponse = (invoiceDetail: InvoiceDetail) => {
    return {
        uuid: invoiceDetail.uuid,
        quantity: invoiceDetail.quantity,
        cost: invoiceDetail.cost,
        total: invoiceDetail.total,
        budgetItem: {
            uuid: invoiceDetail.budgetItem.uuid,
            code: invoiceDetail.budgetItem.code,
            name: invoiceDetail.budgetItem.name
        },
        invoice: {
            uuid: invoiceDetail.invoice.uuid,
            invoice_number: invoiceDetail.invoice.invoice_number,
            total: invoiceDetail.invoice.total,
            date: invoiceDetail.invoice.date,
            supplier: {
                uuid: invoiceDetail.invoice.supplier.uuid,
                name: invoiceDetail.invoice.supplier.name,
                contact_name: invoiceDetail.invoice.supplier.contact_name,
                contact_email: invoiceDetail.invoice.supplier.contact_email,
                contact_phone: invoiceDetail.invoice.supplier.contact_phone
            },
            project: {
                uuid: invoiceDetail.invoice.project.uuid,
                name: invoiceDetail.invoice.project.name
            }
        }
    }
}

export const formatManyInvoiceDetailResponse = (invoiceDetails: InvoiceDetail[]) => {
    return invoiceDetails.map(invoiceDetail => formatOneInvoiceDetailResponse(invoiceDetail))
}