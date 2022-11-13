import { validateUUID } from './../middleware/validateUuid';
import { formatManyUserResponse, formatOneUserResponse } from './../helpers/format';
import { isPasswordValid } from './../middleware/validatePassword';
import { isEmailValid } from './../middleware/validateEmail';
import { getTotalUsers, createUser, getAllUsers, getOneUser, updateUser } from './../controller/users-controller';
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

