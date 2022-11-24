import { User } from './../models/users-entity';
import { QueryRunner } from 'typeorm';
import { v4 } from "uuid"
import { AppDataSource } from "../db/data-source"
import { Company } from '../models/companies-entity';
import { Supplier } from '../models/suppliers-entity';
import { errorType, successType } from '../types/responses-types';
import { supplierCreate, supplierResponse } from '../types/supplier-type';

const supplierRepository = AppDataSource.getRepository(Supplier)
const queryRunner: QueryRunner = AppDataSource.createQueryRunner()

export const createSupplier = async (newSupplier: supplierCreate, company: Company, user: User): Promise<errorType | successType> => {
    
    try {
        await queryRunner.startTransaction()
        const supplierToCreate = new Supplier()
        supplierToCreate.uuid = v4()
        supplierToCreate.supplier_id = newSupplier.supplier_id
        supplierToCreate.name = newSupplier.name
        supplierToCreate.contact_email = newSupplier.contact_email
        supplierToCreate.contact_name = newSupplier.contact_name
        supplierToCreate.contact_phone = newSupplier.contact_phone
        supplierToCreate.company = company
        supplierToCreate.user = user

        await queryRunner.manager.save(supplierToCreate)

        await queryRunner.commitTransaction()

        return {status: 201, detail: supplierToCreate}
    } catch (error: any) {
        await queryRunner.rollbackTransaction()
        if (error.code !== undefined && error.code === '23505') return { status: 409, detail: `Supplier with id: "${newSupplier.supplier_id}" or name: "${newSupplier.name}" already exists`}

        console.error(error);

        return {status: 500, detail: `Unknown error, please check the logs`}
    }
}

export const getAllSuppliers = async (companyUUID: string): Promise<Supplier[]> => {
    const suppliers = await supplierRepository
        .createQueryBuilder("supplier")
        .select("supplier.uuid")
        .addSelect("supplier.supplier_id")
        .addSelect("supplier.name")
        .addSelect("supplier.contact_name")
        .addSelect("supplier.contact_email")
        .addSelect("supplier.contact_phone")
        .andWhere("supplier.companyUuid = :companyUuid")
        .setParameter("companyUuid", companyUUID)
        .orderBy("supplier.name")
        .getMany()

    return suppliers
}

export const getOneSupplier = async (companyUUID: string, supplierUUID: string): Promise<Supplier | null> => {
    const supplier = await supplierRepository
        .createQueryBuilder("supplier")
        .select("supplier.uuid")
        .addSelect("supplier.supplier_id")
        .addSelect("supplier.name")
        .addSelect("supplier.contact_name")
        .addSelect("supplier.contact_email")
        .addSelect("supplier.contact_phone")
        .andWhere("supplier.companyUuid = :companyUuid")
        .andWhere("supplier.uuid = :supplierUUID")
        .setParameter("companyUuid", companyUUID)
        .setParameter("supplierUUID", supplierUUID)
        .orderBy("supplier.name")
        .getOne()

    return supplier
}

export const updateSupplier = async (updatedSupplierInformation: supplierCreate, supplierToUpdate: Supplier): Promise<errorType | successType> => {

    supplierToUpdate.supplier_id = updatedSupplierInformation.supplier_id !== null ? updatedSupplierInformation.supplier_id : supplierToUpdate.supplier_id
    supplierToUpdate.name = updatedSupplierInformation.name !== null ? updatedSupplierInformation.name : supplierToUpdate.name
    supplierToUpdate.contact_name = updatedSupplierInformation.contact_name !== null ? updatedSupplierInformation.contact_name : supplierToUpdate.contact_name
    supplierToUpdate.contact_email = updatedSupplierInformation.contact_email !== null ? updatedSupplierInformation.contact_email : supplierToUpdate.contact_email
    supplierToUpdate.contact_phone = updatedSupplierInformation.contact_phone !== null? updatedSupplierInformation.contact_phone : supplierToUpdate.contact_phone

    try {
        await queryRunner.startTransaction()

        await queryRunner.manager.save(supplierToUpdate)

        await queryRunner.commitTransaction()

        return {status: 200, detail: supplierToUpdate}
    } catch (error: any) {
        await queryRunner.rollbackTransaction()
         if (error.code !== undefined && error.code === '23505') return { status: 409, detail: `Supplier with id: "${updatedSupplierInformation.supplier_id}" or name: "${updatedSupplierInformation.name}" already exists`}

         console.error(error)
         return {status: 500, detail: `Unknown error, please check the logs`}
    }
}

export const getOneSupplierWithSupplierResponse = async (supplierUUID: string, companyUUID: string): Promise<Supplier | null> => {
    const supplier = await supplierRepository
        .createQueryBuilder("supplier")
        .andWhere("supplier.companyUuid = :companyUuid")
        .andWhere("supplier.uuid = :supplierUUID")
        .setParameter("companyUuid", companyUUID)
        .setParameter("supplierUUID", supplierUUID)
        .orderBy("supplier.name")
        .getOne()

    return supplier
}