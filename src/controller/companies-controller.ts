import { successType } from './../types/responses-types';
import { errorType } from '../types/responses-types';
import { v4 } from 'uuid'
import { Company } from '../models/companies-entity';
import { User } from '../models/users-entity';
import { companyCreate } from './../types/company-type'
import { AppDataSource } from '../db/data-source'

const companyRepository = AppDataSource.getRepository(Company)
const queryRunner = AppDataSource.createQueryRunner()

export const createCompany = async (newCompany: companyCreate ): Promise<errorType | successType>=> {
    const company = new Company()
    company.uuid = v4()
    company.name = newCompany.name
    company.ruc = newCompany.ruc
    company.employees = newCompany.employees
    
    try {
        await queryRunner.startTransaction()
        await queryRunner.manager.save(company)
        
        const user = new User()
        user.uuid = v4()
        user.company = company
        user.email = newCompany.email
        user.password = newCompany.password
        user.name = newCompany.fullname

        await queryRunner.manager.save(user)

        await queryRunner.commitTransaction()
        return {status: 201, detail: company}
    } catch (error: any) {
        await queryRunner.rollbackTransaction()
        if (error.code !== undefined && error.code === '23505') return { status: 409, detail: `Company with name: "${newCompany.name} "or ruc: "${newCompany.ruc}" already exists`}

        console.error(error)
        return {status: 500, detail: `Something went wrong`}
    }

}

