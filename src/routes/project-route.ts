import { projectResponse } from './../types/project-type';
import { validateUUID } from './../middleware/validateUuid';
import { createProject, getAllProjects, getOneProject } from './../controller/project-controller';
import { validateToken } from './../middleware/validateToken';
import express, { Request, Response, Router } from 'express';
import { Company } from '../models/companies-entity';
import { User } from '../models/users-entity';
import { getCompany } from '../controller/companies-controller';
import { getOneUser } from '../controller/users-controller';

const router: Router = express.Router()

router.post('/', validateToken, async (req: Request, res: Response) => {
    const { userUUID, companyUUID } = res.locals.token

    const { name, is_active } = req.body

    // DATA VALIDATION
    if (!name) return res.status(400).json({detail: "The project name is required"})
    if (is_active === undefined) return res.status(400).json({detail: "The status of the project is required"})
    if (typeof is_active !== 'boolean') return res.status(400).json({detail: "The status of the project is either true or false"})

    const company: Company | null = await getCompany(companyUUID)
    if (!company) return res.status(404).json({detail: "Company not found"})

    const user: User | null = await getOneUser(userUUID, companyUUID)
    if (!user) return res.status(404).json({detail: `User not found`})
    // END OF DATA VALIDATION

    const createdProjectResponse = await createProject(req.body, company, user)
    
    return res.status(createdProjectResponse.status).json({detail: createdProjectResponse.detail})
})

router.get("/", validateToken, async (req: Request, res: Response) => {
    const { companyUUID } = res.locals.token

    const projects: projectResponse[] = await getAllProjects(companyUUID)

    return res.status(200).json({detail: projects})
})

router.get("/:uuid", validateToken, validateUUID, async(req: Request, res: Response) => {
    const { companyUUID } = res.locals.token
    const projectUUID = req.params.uuid

    const project: projectResponse | null = await getOneProject(projectUUID, companyUUID)

    if(!project) return res.status(404).json({detail: `No project with uuid: ${projectUUID}`})

    return res.status(200).json({detail: project})
})

export default router
