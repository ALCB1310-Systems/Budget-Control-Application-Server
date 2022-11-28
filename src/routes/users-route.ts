import { validateData } from './../middleware/dataValidation';
import { validateUUID } from './../middleware/validateUuid';
import { formatManyUserResponse, formatOneUserResponse } from './../helpers/format';
import { getTotalUsers, createUser, getAllUsers, getOneUser, updateUser } from './../controller/users-controller';
import { validateToken } from './../middleware/validateToken';
import express, { Request, Response, Router } from 'express'
import { Company } from '../models/companies-entity';
import { getCompany } from '../controller/companies-controller';
import { createUserValidator } from '../validators/user-validator';

const router: Router = express.Router()

router.post('/', validateToken, validateData(createUserValidator), async (req: Request, res: Response) => {
    const { companyUUID } = res.locals.token
    const { email, password, name } = req.body

    // DATA VALIDATION
    const company: Company | null = await getCompany(companyUUID)
    if (!company) return res.status(404).json({detail: "Company not found"})
    //  END OF DATA VALIDATION

    // MUST ONLY BE ALLOWED TO CREATE AS MANY USERS AS THE COMPANY HAS EMPLOYEES
    const totalUsers = await getTotalUsers(company)
    if(totalUsers >= company.employees) return res.status(403).json({detail: "Unauthorized: Maximum amount of registered users reached"})
    // END OF AUTHORIZATION
    
    const createUserResponse = await createUser({email, password, name, company})

    if (createUserResponse.status === 409 )
        return res.status(createUserResponse.status).json({detail: createUserResponse.detail})

    return res.status(createUserResponse.status).json({detail: formatOneUserResponse(createUserResponse.detail, company)})

})

router.get("/", validateToken,async (req: Request, res: Response) => {
    const { companyUUID } = res.locals.token

    // DATA VALIDATION
    const company: Company | null = await getCompany(companyUUID)
    if (!company) return res.status(404).json({detail: "Company not found"})
    //  END OF DATA VALIDATION

    const users = await getAllUsers(companyUUID)

    res.status(200).json({detail: formatManyUserResponse(users, company)})
})

router.get("/:uuid", validateToken, validateUUID, async (req: Request, res: Response) => {
    const { companyUUID, userUUID } = res.locals.token
	const uuid: string = req.params.uuid;
    
    const uuidToLook = uuid.toLowerCase() === 'me' ? userUUID : uuid

    // DATA VALIDATION
    const company: Company | null = await getCompany(companyUUID)
    if (!company) return res.status(404).json({detail: "Company not found"})
    //  END OF DATA VALIDATION

    const user = await getOneUser(uuidToLook, companyUUID)

    if (!user) return res.status(404).json({detail: `No user found`})

    return res.status(200).json({detail: formatOneUserResponse(user, company)})
})

router.put("/:uuid", validateToken, validateUUID,async (req: Request, res: Response) => {
    const { companyUUID, userUUID } = res.locals.token
	const uuid: string = req.params.uuid;
    
    const uuidToLook = uuid.toLowerCase() === 'me' ? userUUID : uuid

    // DATA VALIDATION
    const company: Company | null = await getCompany(companyUUID)
    if (!company) return res.status(404).json({detail: "Company not found"})
    //  END OF DATA VALIDATION

    const user = await getOneUser(uuidToLook, companyUUID)

    if (!user) return res.status(404).json({detail: `No user found`})

    const updateUserResponse = await updateUser(req.body, user)

    return res.status(updateUserResponse.status).json({detail: formatOneUserResponse(updateUserResponse.detail, company)})
})

export default router

