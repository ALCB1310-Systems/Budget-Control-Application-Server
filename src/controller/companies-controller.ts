import { saveUser } from './users-controller';
import { successType } from './../types/responses-types';
import { errorType } from '../types/responses-types';
import { v4 } from 'uuid'
import { Company } from '../models/companies-entity';
import { companyCreate } from './../types/company-type'
import { AppDataSource } from '../db/data-source'
import { QueryRunner } from 'typeorm';
import { userCreate } from '../types/users-type';

const companyRepository = AppDataSource.getRepository(Company)
const queryRunner: QueryRunner = AppDataSource.createQueryRunner()

export const createCompany = async (newCompany: companyCreate ): Promise<errorType | successType>=> {
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
        if (error.code !== undefined && error.code === '23505' && error.table === 'user') return { status: 409, detail: `User with name: "${newCompany.fullname} "or ruc: "${newCompany.email}" already exists`}

        console.error(error)

        return {status: 500, detail: `Something went wrong check the server's logs`}
    }

}

