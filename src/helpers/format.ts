import { budgetItemResponse } from './../types/budget-items-type';
import { BudgetItem } from './../models/budget-items-entity';
import { projectResponse } from './../types/project-type';
import { supplierResponse } from './../types/supplier-type';
import { Supplier } from './../models/suppliers-entity';
import { userResponse } from './../types/users-type';
import { Company } from "../models/companies-entity";
import { User } from "../models/users-entity";
import { Project } from '../models/projects-entity';

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