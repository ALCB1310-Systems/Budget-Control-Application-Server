import { invoiceUpdate } from './../types/invoice-types';
import { formatOneInvoiceResponse } from './../helpers/format';
import { QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';
import { errorType, successType } from './../types/responses-types';
import { Company } from "../models/companies-entity";
import { User } from "../models/users-entity";
import { invoiceCreate } from "../types/invoice-types";
import { AppDataSource } from '../db/data-source';
import { Invoice } from '../models/invoce-entity';
import { v4 } from 'uuid';
import { debug } from 'console';

const invoiceRepository: Repository<Invoice> = AppDataSource.getRepository(Invoice)
const queryRunner: QueryRunner = AppDataSource.createQueryRunner()

export const createInvoice = async (invoiceToCreate: invoiceCreate, company: Company, user: User): Promise<errorType | successType> => {
    try {
        await queryRunner.startTransaction()
        
        const newInvoice = new Invoice()
        newInvoice.uuid = v4()
        newInvoice.company = company
        newInvoice.user = user
        newInvoice.project = invoiceToCreate.project
        newInvoice.supplier = invoiceToCreate.supplier
        newInvoice.invoice_number = invoiceToCreate.invoice_number
        newInvoice.date = invoiceToCreate.date
        newInvoice.total = 0

        await queryRunner.manager.save(newInvoice)

        await queryRunner.commitTransaction()

        return {status: 201, detail: formatOneInvoiceResponse(newInvoice)}
    } catch (error: any) {
        await queryRunner.rollbackTransaction()

        if (error.code === '23505') return {status: 409, detail: `Invoice for supplier ${invoiceToCreate.supplier.name} with number ${invoiceToCreate.invoice_number} already exists`}

        console.error(error);
        return {status: 500, detail: `Something went wrong please check your logs`}
    }
}

export const getAllInvoices = async (companyUUID: string, projectName: string | undefined = undefined): Promise<Invoice[]> => {
    const invoicesQuery: SelectQueryBuilder<Invoice> = invoiceRepository.createQueryBuilder('invoice')
        .leftJoinAndSelect('invoice.project', 'project')
        .leftJoinAndSelect('invoice.supplier', 'supplier')
        .andWhere("invoice.companyUuid = :companyUuid")
        .setParameter("companyUuid", companyUUID)

    if (projectName){
        invoicesQuery.andWhere('lower(project.name) = :projectName')
            .setParameter('projectName', projectName.trim().toLowerCase())
    }

    const invoices: Invoice[] = await invoicesQuery
        .addOrderBy('project.name')
        .addOrderBy('invoice.date')
        .addOrderBy('supplier.name')
        .addOrderBy('invoice.invoice_number')
        .getMany()

    return invoices
}

export const getOneInvoice = async(invoiceUUID: string, companyUUID: string): Promise<Invoice | null> => {
    const invoice: Invoice | null = await invoiceRepository.createQueryBuilder('invoice')
        .leftJoinAndSelect('invoice.project', 'project')
        .leftJoinAndSelect('invoice.supplier', 'supplier')
        .andWhere("invoice.companyUuid = :companyUuid")
        .andWhere("invoice.uuid = :uuid")
        .setParameter("companyUuid", companyUUID)
        .setParameter("uuid", invoiceUUID)
        .getOne()

    return invoice
}

export const updateInvoice = async(updatedInfo: invoiceUpdate, invoiceToUpdate: Invoice): Promise<errorType | successType> => {
    try {
        await queryRunner.startTransaction()

        invoiceToUpdate.invoice_number = updatedInfo.invoice_number || invoiceToUpdate.invoice_number
        invoiceToUpdate.date = updatedInfo.date || invoiceToUpdate.date

        await queryRunner.manager.save(invoiceToUpdate)

        await queryRunner.commitTransaction()

        return {status: 200, detail: formatOneInvoiceResponse(invoiceToUpdate)}
    } catch (error: any) {
        await queryRunner.rollbackTransaction()
        console.error(error)
        return {status: 500, detail: "Unknwon error please check your logs"}
    }
}