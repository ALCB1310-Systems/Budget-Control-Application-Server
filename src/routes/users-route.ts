import { isPasswordValid } from './../middleware/validatePassword';
import { isEmailValid } from './../middleware/validateEmail';
import { getTotalUsers, createUser } from './../controller/users-controller';
import { userCreate } from './../types/users-type';
import { validateToken } from './../middleware/validateToken';
import express, { Request, Response, Router } from 'express'
import { Company } from '../models/companies-entity';
import { getCompany } from '../controller/companies-controller';

const router: Router = express.Router()

router.post('/', validateToken, async (req: Request, res: Response) => {
    const { companyUUID } = res.locals.token
    if (req.body && Object.keys(req.body).length === 0 && Object.getPrototypeOf(req.body) === Object.prototype ) return res.status(400).json({detail: `Need to send user information`})

    const { email, password, name }: userCreate = req.body

    // DATA VALIDATION
    if (!email) return res.status(400).json({detail: "Must provide an email"})
    if (!isEmailValid) return res.status(400).json({detail: "Must provide a valid email"})

    if (!password) return res.status(400).json({detail: "Must provide a password"})
    if (!isPasswordValid(password)) return res.status(400).json("Must provide a valid password")

    if(!name) return res.status(400).json({detail: "Must provide the user's name"})

    const company: Company | null = await getCompany(companyUUID)
    if (!company) return res.status(404).json({detail: "Company not found"})
    //  END OF DATA VALIDATION

    // MUST ONLY BE ALLOWED TO CREATE AS MANY USERS AS THE COMPANY HAS EMPLOYEES
    const totalUsers = await getTotalUsers(company)
    if(totalUsers >= company.employees) return res.status(403).json({detail: "Unauthorized: Maximum amount of registered users reached"})
    // END OF AUTHORIZATION
    
    const createUserResponse = await createUser({email, password, name, company})

    return res.status(createUserResponse.status).json(createUserResponse.detail)
})

router.get("/", validateToken,async (req:Request, res: Response) => {
    const { companyUUID } = res.locals.token

    res.sendStatus(204)
})

export default router

