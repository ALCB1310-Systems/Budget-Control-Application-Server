import { createCompanyValidator } from './../validation/company-validate';
import { Company } from './../models/companies-entity';
import { validateToken } from './../middleware/validateToken';
import { isEmailValid } from './../middleware/validateEmail';
import { createCompany, getCompany, updateCompany } from './../controller/companies-controller';
import express, { Request, Response, Router } from 'express'
import { companyCreate, companyResponse } from '../types/company-type'
import { isDataValid } from '../validation/validateData';

const router: Router = express.Router()

router.post('/', async (req: Request, res: Response) => {
    if (req.body && Object.keys(req.body).length === 0 && Object.getPrototypeOf(req.body) === Object.prototype ) return res.status(400).json({detail: `Need to send user information`})

    const { ruc, name, employees, email, password, fullname }: companyCreate = req.body

    const dataValid = isDataValid(req.body, createCompanyValidator)

    console.log(dataValid);
    if (!dataValid.status) 
        return res.status(400).json({detail: {
            key: dataValid.errorKey,
            description: dataValid.errorDescription
        }})
        
    const createCompanyResult =  await createCompany(req.body)

    return res.status(createCompanyResult.status).json({detail: createCompanyResult.detail})
})

router.get('/', validateToken, async (req: Request, res: Response) => {
    const { companyUUID } = res.locals.token
    
    const company: companyResponse | null = await getCompany(companyUUID)
    
    return res.status(200).json({data: company})
})

router.put("/", validateToken,async (req:Request, res: Response) => {
    const { companyUUID } = res.locals.token
    let { ruc, name, employees }: companyCreate = req.body
    
    const company: Company | null = await getCompany(companyUUID)
    if (!company) return res.status(404).json({detail: `No company found`})

    if(!ruc) ruc = company?.ruc
    if(!name) name = company?.name
    if(!employees) employees = company.employees

    const updateCompanyResult = await updateCompany({ruc, name, employees}, company)

    return res.status(updateCompanyResult.status).json({detail: updateCompanyResult.detail})
    
})

export default router