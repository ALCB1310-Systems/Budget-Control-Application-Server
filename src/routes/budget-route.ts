import { debug } from 'console';
import { validateData } from './../middleware/dataValidation';
import { errorType, successType } from './../types/responses-types';
import { validateUUID } from './../middleware/validateUuid';
import { formatManyBudgetResponse } from './../helpers/format';
import { createNewBudget, getAllBudgets, getOneBudget, getOneBudgetWithBudgetResponse, updateBudget } from './../controller/budget-controller';
import { budgetCreate, budgetUpdate } from './../types/budget-type';
import { getOneProject } from './../controller/project-controller';
import { getCompany } from './../controller/companies-controller';
import { getOneUser } from './../controller/users-controller';
import { validateToken } from '../middleware/validateToken';
import { Request, Response, Router } from "express";
import { isValidUUID } from '../middleware/validateUuid';
import { getOneBudgetItem } from '../controller/budget-items-controller';
import { budgetCreateValidator, updateBudgetValidator } from '../validators/budget-validator';

const router: Router = Router()

router.post("/", validateToken, validateData(budgetCreateValidator ), async (req: Request, res: Response) => {
    const { userUUID, companyUUID } = res.locals.token

    const { budget_item_id, project_id, quantity, cost } = req.body

    // DATA VALIDATION
    const user = await getOneUser(userUUID, companyUUID)
    if (!user) return res.status(404).json({detail: "You are logged in with an unknown user"})

    const company = await getCompany(companyUUID)
    if (!company) return res.status(404).json({detail: "You are logged in with an unknown company"})

    const budget_item = await getOneBudgetItem(budget_item_id, companyUUID)
    if (!budget_item) return res.status(404).json({detail: `Budget item with uuid ${budget_item_id} not found`})

    const project = await getOneProject(project_id, companyUUID)
    if (!project) return res.status(404).json({detail: `Project with uuid ${project_id} not found`})
    // END OF DATA VALIDATION

    const total: number = quantity * cost
    const newBudget: budgetCreate = { quantity, cost, total, budgetItem: budget_item.detail, project, user, company }

    const newBudgetResponse = await createNewBudget(newBudget)

    return res.status(newBudgetResponse.status).json({detail: newBudgetResponse.detail})
})

router.get("/", validateToken, async (req: Request, res: Response) => {
    const { companyUUID } = res.locals.token
    const project = req.query.project

    if (project && typeof project !== 'string') return res.status(400).json({detail: `Project name is not valid`})
    // if (project && !isValidUUID(project)) return res.status(400).json({detail: `Project uuid is not valid`})

    const budgets = await getAllBudgets(companyUUID, project)

    const formattedBudget = formatManyBudgetResponse(budgets)

    return res.status(200).json({detail: formattedBudget})
})

router.get("/:uuid", validateToken, validateUUID, async(req: Request, res: Response) => {
    const { companyUUID } = res.locals.token

    const budgetUUID = req.params.uuid

    const budget = await getOneBudget(budgetUUID, companyUUID)

    return res.status(budget.status).json({detail: budget.detail})
})

router.put("/:uuid", validateToken, validateUUID, validateData(updateBudgetValidator), async(req: Request, res: Response) => {
    const { companyUUID } = res.locals.token
    const budgetUUID = req.params.uuid
    const { quantity, cost } = req.body

    const total = quantity * cost

    const updateBudgetInfo: budgetUpdate = {quantity, cost, total}

    const budget = await getOneBudgetWithBudgetResponse(budgetUUID, companyUUID)
    if(!budget) return res.status(404).json({detail: `Budget with uuid: ${budgetUUID} does not exist`})

    const updateBudgetResponse: errorType | successType = await updateBudget(updateBudgetInfo, budget, companyUUID)

    return res.status(updateBudgetResponse.status).json({detail: updateBudgetResponse.detail})

})

export default router