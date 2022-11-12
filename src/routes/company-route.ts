import { createCompany } from './../controller/companies-controller';
import express, { Request, Response, Router } from 'express'
import { companyCreate } from '../types/company-type'

const router: Router = express.Router()

router.post('/', async (req: Request, res: Response) => {
    if (req.body && Object.keys(req.body).length === 0 && Object.getPrototypeOf(req.body) === Object.prototype ) return res.status(400).json({detail: `Need to send user information`})

    const { ruc, name, employees }: companyCreate = req.body

    if(!ruc) return res.status(400).json({detail: "The ruc field is required"})
    if(!name) return res.status(400).json({detail: "The name field is required"})
    if(!employees) return res.status(400).json({detail: "The employees field is required"})
    
    const createCompanyResult = await createCompany(req.body)

    return res.status(createCompanyResult.status).json({detail: createCompanyResult.detail})
})

export default router