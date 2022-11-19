import { Company } from './../models/companies-entity';
import { saveUser } from './users-controller';
import { successType } from './../types/responses-types';
import { errorType } from '../types/responses-types';
import { v4 } from 'uuid'
import { companyCreate, companyUpdate } from './../types/company-type'
import { AppDataSource } from '../db/data-source'
import { QueryRunner, Repository } from 'typeorm';
import { userCreate } from '../types/users-type';

const companyRepository: Repository<Company> = AppDataSource.getRepository(Company)
const queryRunner: QueryRunner = AppDataSource.createQueryRunner()

export const createCompany = async (newCompany: companyCreate ): Promise<errorType | successType> => {
    const company = new Company()
    company.uuid = v4()
    company.name = newCompany.name
    company.ruc = newCompany.ruc
    company.employees = newCompany.employees
    
    try {
        await queryRunner.startTransaction()
        await queryRunner.manager.save(company)

        const userData: userCreate = {
            company: company,
            email: newCompany.email,
            password: newCompany.password,
            name: newCompany.fullname,
        }
        await saveUser(userData, queryRunner)

        await queryRunner.commitTransaction()
        return {status: 201, detail: company}
    } catch (error: any) {
        await queryRunner.rollbackTransaction()
        if (error.code !== undefined && error.code === '23505' && error.table === 'company') return { status: 409, detail: `Company with name: "${newCompany.name} "or ruc: "${newCompany.ruc}" already exists`}
        if (error.code !== undefined && error.code === '23505' && error.table === 'user') return { status: 409, detail: `User with name: "${newCompany.fullname} "or email: "${newCompany.email}" already exists`}

        console.error(error)

        return {status: 500, detail: `Something went wrong check the server's logs`}
    }
}

export const getCompany = async (companyUUID: string): Promise<Company | null> => {
    // return await companyRepository.findOneBy({uuid: companyUUID})

    return companyRepository.createQueryBuilder("company")
        .select("company.uuid")
        .addSelect("company.ruc")
        .addSelect("company.name")
        .addSelect("company.employees")
        .where("company.uuid = :uuid")
        .setParameter("uuid", companyUUID)
        .getOne()
}

export const updateCompany =async (updatedData: companyUpdate, existingCompany: Company) : Promise<errorType | successType> => {
    existingCompany.ruc = updatedData.ruc
    existingCompany.name = updatedData.name
    existingCompany.employees = updatedData.employees

    try {
        await companyRepository.save(existingCompany)

        return {status: 200, detail: existingCompany}
    } catch (error: any) {
        if (error.code !== undefined && error.code === '23505' && error.table === 'company') return { status: 409, detail: `Company with name: "${updatedData.name} "or ruc: "${updatedData.ruc}" already exists`}
        console.error(error)

        return {status: 500, detail: `Something went wrong check the server's logs`}
        
    }
}

