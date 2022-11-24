import { validateData } from './../middleware/dataValidation';
import { createCompanyValidator, updateCompanyValidator } from '../validators/company-validate';
import { Company } from './../models/companies-entity';
import { validateToken } from './../middleware/validateToken';
import { createCompany, getCompany, updateCompany } from './../controller/companies-controller';
import express, { Request, Response, Router } from 'express'
import { companyCreate } from '../types/company-type'

const router: Router = express.Router()

router.post('/', validateData(createCompanyValidator), async (req: Request, res: Response) => {
    const createCompanyResult =  await createCompany(req.body)

    return res.status(createCompanyResult.status).json({detail: createCompanyResult.detail})
})

router.get('/', validateToken, async (req: Request, res: Response) => {
    const { companyUUID } = res.locals.token
    
    const company: Company | null = await getCompany(companyUUID)
    
    return res.status(200).json({data: company})
})

router.put("/", validateToken, validateData(updateCompanyValidator),async (req:Request, res: Response) => {
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