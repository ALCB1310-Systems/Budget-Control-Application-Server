import { validateData } from './../middleware/dataValidation';
import { errorType, successType } from './../types/responses-types';
import { projectResponse } from './../types/project-type';
import { validateUUID } from './../middleware/validateUuid';
import { createProject, getAllProjects, getOneProject, updateProject } from './../controller/project-controller';
import { validateToken } from './../middleware/validateToken';
import express, { Request, Response, Router } from 'express';
import { Company } from '../models/companies-entity';
import { User } from '../models/users-entity';
import { getCompany } from '../controller/companies-controller';
import { getOneUser } from '../controller/users-controller';
import { createProjectValidator, updateProjectValidator } from '../validators/project-validator';

const router: Router = express.Router()

router.post('/', validateToken, validateData(createProjectValidator), async (req: Request, res: Response) => {
    const { userUUID, companyUUID } = res.locals.token

    // DATA VALIDATION
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

router.put("/:uuid", validateToken, validateUUID, validateData(updateProjectValidator), async (req: Request, res: Response) => {
    const { companyUUID } = res.locals.token
    const projectUUID = req.params.uuid

    const project: projectResponse | null = await getOneProject(projectUUID, companyUUID)
    if(!project) return res.status(404).json({detail: `No project with uuid: ${projectUUID}`})

    const updateProjectResponse: errorType | successType = await updateProject(req.body, project)

    return res.status(updateProjectResponse.status).json({detail: updateProjectResponse.detail})
})

export default router
