import { User } from './../models/users-entity';
import { QueryRunner } from 'typeorm';
import { v4 } from "uuid"
import { AppDataSource } from "../db/data-source"
import { Company } from '../models/companies-entity';
import { Supplier } from '../models/suppliers-entity';
import { errorType, successType } from '../types/responses-types';
import { supplierCreate, supplierResponse } from '../types/supplier-type';

const userRepository = AppDataSource.getRepository(Supplier)
const queryRunner: QueryRunner = AppDataSource.createQueryRunner()

export const createSupplier = async (newSupplier: supplierCreate, company: Company, user: User): Promise<errorType | successType> => {
    const supplierToCreate = new Supplier()
    supplierToCreate.uuid = v4()
    supplierToCreate.supplier_id = newSupplier.supplier_id
    supplierToCreate.name = newSupplier.name
    supplierToCreate.contact_email = newSupplier.contact_email
    supplierToCreate.contact_name = newSupplier.contact_name
    supplierToCreate.contact_phone = newSupplier.contact_phone
    supplierToCreate.company = company
    supplierToCreate.user = user

    try {
        await queryRunner.startTransaction()

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

export const getAllSuppliers = async (companyUUID: string): Promise<supplierResponse[]> => {
    const suppliers = await userRepository
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

export const getOneSupplier = async (companyUUID: string, supplierUUID: string): Promise<supplierResponse | null> => {
    const supplier = await userRepository
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