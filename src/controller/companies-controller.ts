import { successType } from './../types/responses-types';
import { errorType } from '../types/responses-types';
import { v4 } from 'uuid'
import { Company } from '../models/companies-entity';
import { companyCreate, companyResponse } from './../types/company-type'
import { AppDataSource } from '../db/data-source'

const companyRepository = AppDataSource.getRepository(Company)

export const createCompany = async (newCompany: companyCreate ): Promise<errorType | successType>=> {
    const company = new Company()
    company.uuid = v4()
    company.name = newCompany.name
    company.ruc = newCompany.ruc
    company.employees = newCompany.employees

    try {
        await companyRepository.save(company)

        return {status: 201, detail: company}
    } catch (error: any) {
        if (error.code !== undefined && error.code === '23505') return { status: 409, detail: `Company with name: "${newCompany.name} "or ruc: "${newCompany.ruc}" already exists`}

        console.error(error)
        return {status: 500, detail: `Something went wrong`}
    }

}