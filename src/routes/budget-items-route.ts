import { validateUUID } from './../middleware/validateUuid';
import { createBudgetItem, getAllBudgetItems, getOneBudgetItem, updateBudgetItem } from './../controller/budget-items-controller';
import { getOneUser } from './../controller/users-controller';
import { validateToken } from './../middleware/validateToken';
import { Request, Response, Router } from "express";
import { isValidUUID } from '../middleware/validateUuid';
import { getCompany } from '../controller/companies-controller';
import { Company } from '../models/companies-entity';
import { User } from '../models/users-entity';

const router: Router = Router()

router.post("/", validateToken, async (req: Request, res: Response) => {
    const { userUUID, companyUUID } = res.locals.token

    const { code, name, accumulates, level, parentUuid } = req.body

    // DATA VALIDATION BEGIN
    if (!code) return res.status(400).json({detail: "The budget item code is a required field"})
    if (!name) return res.status(400).json({detail: "The budget item name is a required field"})
    if (accumulates === undefined) return res.status(400).json({detail: "You've got to define if the budget item accumulates or not"})
    if (typeof accumulates !== 'boolean') return res.status(400).json({detail: "The accumulate field must be true or false"})
    if (level === undefined) return res.status(400).json({detail: "You must define in what level the budget item is"})
    if (typeof level !== 'number') return res.status(400).json({detail: "The level must be a number"})
    if (parentUuid && !isValidUUID(parentUuid)) return res.status(400).json({detail: "Please provide a valid UUID for the parent"})

    const company: Company|null = await getCompany(companyUUID)
    if (!company) return res.status(404).json({detail: `No company found with your logged in information`})

    const user: User|null = await getOneUser(userUUID, companyUUID)
    if (!user) return res.status(404).json({detail: `No user found with your logged in information`})
    // DATA VALIDATION END

    const newBudgetItemResponse = await createBudgetItem(req.body, company, user)

    return res.status(newBudgetItemResponse.status).json({detail: newBudgetItemResponse.detail})
})

router.get("/", validateToken, async (req: Request, res: Response) => {
    const { companyUUID } = res.locals.token

    const budgetItemsResponseData = await getAllBudgetItems(companyUUID)

    return res.status(200).json({detail: budgetItemsResponseData})
})

router.get("/:uuid", validateToken, validateUUID, async (req: Request, res: Response) => {
    const { companyUUID } = res.locals.token
    const budgetItemUUID = req.params.uuid

    const budgetItemResponseData = await getOneBudgetItem(budgetItemUUID, companyUUID)

    return res.status(budgetItemResponseData.status).json({detail: budgetItemResponseData.detail})
})

router.put("/:uuid", validateToken, validateUUID,async (req:Request, res: Response) => {
    const { companyUUID } = res.locals.token
    const budgetItemUUID = req.params.uuid

    const company = await getCompany(companyUUID)
    if (!company) return res.status(404).json({detail: "Company not found"})

    const budgetItemToUpdate = await getOneBudgetItem(budgetItemUUID, companyUUID)

    if (budgetItemToUpdate.status !== 200) return res.status(budgetItemToUpdate.status).json({detail: budgetItemToUpdate.detail})

    const updatedBudgetItemResponse = await updateBudgetItem(req.body, budgetItemToUpdate.detail, company)
    return res.status(updatedBudgetItemResponse.status).json({detail: updatedBudgetItemResponse.detail})
})

export default router