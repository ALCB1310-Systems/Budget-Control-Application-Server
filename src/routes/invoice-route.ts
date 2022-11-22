import { getBudgetByItemAndProject } from './../controller/budget-controller';
import { Project } from './../models/projects-entity';
import { getOneBudgetItemWithBudgetItemResponse } from './../controller/budget-items-controller';
import { BudgetItem } from './../models/budget-items-entity';
import { createInvoiceDetail, getAllInvoiceDetaile } from '../controller/invoice-details-controller';
import { errorType, successType } from './../types/responses-types';
import { Invoice } from './../models/invoce-entity';
import { validateUUID, isValidUUID } from './../middleware/validateUuid';
import { formatManyInvoicesResponse, formatOneInvoiceResponse, formatManyInvoiceDetailResponse } from './../helpers/format';
import { debug } from 'console';
import { isValidDate } from './../helpers/dateValidation';
import { Company } from './../models/companies-entity';
import { getOneSupplierWithSupplierResponse } from './../controller/supplier-controller';
import { invoiceCreate, invoiceUpdate } from './../types/invoice-types';
import { getOneProject } from './../controller/project-controller';
import { validateToken } from './../middleware/validateToken';
import { Request, Response, Router } from "express";
import { Supplier } from '../models/suppliers-entity';
import { getCompany } from '../controller/companies-controller';
import { User } from '../models/users-entity';
import { getOneUser } from '../controller/users-controller';
import { createInvoice, getAllInvoices, getOneInvoice, updateInvoice } from '../controller/invoice-controller';
import { Budget } from '../models/budget-entity';
import { InvoiceDetail } from '../models/invoice-details-entity';

const router: Router = Router()

router.post("/", validateToken, async (req: Request, res: Response) => {
    const { companyUUID, userUUID } = res.locals.token
    const { supplier, project, invoice_number, date } = req.body

    // DATA VALIDATION}
    if (!supplier || !isValidUUID(supplier)) return res.status(400).json({detail: `Need to provide a valid UUID for the supplier`})
    if (!project || !isValidUUID(project)) return res.status(400).json({detail: `Need to provide a valid UUID for the project`})

    const selectedSupplier: Supplier | null = await getOneSupplierWithSupplierResponse(supplier, companyUUID)
    if (!selectedSupplier) return res.status(404).json({detail: `Supplier with uuid: ${supplier} does not exist`})

    const selectedProject: Project | null = await getOneProject(project, companyUUID)
    if (!selectedProject) return res.status(404).json({detail: `Project with uuid: ${project} does not exist`})

    const company: Company | null = await getCompany(companyUUID)
    if (!company) return res.status(404).json({detail: `Could not get the company you are logged in as`})

    const user: User | null = await getOneUser(userUUID, companyUUID)
    if (!user) return res.status(404).json({detail: `Could not get the user your are logged in as`})

    let invoiceNumber: string
    if (typeof invoice_number !== 'string') invoiceNumber = invoice_number.toString()
    else invoiceNumber = invoice_number

    if (!isValidDate(date)) return res.status(400).json({detail: `The date ${date} is not valid, please provide it in the format YYYY-MM-DD`})

    const invoiceDate = new Date(date)
    const localOffset = new Date().getTimezoneOffset(); // in minutes
    const localOffsetMillis = 60 * 1000 * localOffset;
    const localMidnight = new Date(invoiceDate.getTime() + localOffsetMillis);

    // END OF DATA VALIDATION
    const invoiceToCreate: invoiceCreate = {
        project: selectedProject,
        supplier: selectedSupplier,
        invoice_number: invoiceNumber,
        date: localMidnight
    }

    const createdInvoiceResponse = await createInvoice(invoiceToCreate, company, user)

    return res.status(createdInvoiceResponse.status).json({detail: createdInvoiceResponse.detail})
})

router.get("/", validateToken, async (req: Request, res: Response) => {
    const { companyUUID } = res.locals.token
    const projectName  = req.query.project?.toString()

    const invoices = await getAllInvoices(companyUUID, projectName)

    return res.status(200).json({detail: formatManyInvoicesResponse(invoices)})
})

router.get("/:uuid", validateToken, validateUUID, async (req: Request, res: Response) => {
    const { companyUUID } = res.locals.token
    const { uuid } = req.params

    const oneInvoiceResponse = await getOneInvoice(uuid, companyUUID)
    if (!oneInvoiceResponse) return res.status(404).json({detail: `Invoice with uuid: ${uuid} not found`})

    return res.status(200).json({detail: formatOneInvoiceResponse(oneInvoiceResponse)})
})

router.put("/:uuid", validateToken, validateUUID, async (req: Request, res: Response) => {
    const { companyUUID } = res.locals.token
    const invoiceUUID = req.params.uuid

    const { invoice_number, date } = req.body

    // DATA VALIDATION

    let invoiceNumber: string
    if (typeof invoice_number !== 'string') invoiceNumber = invoice_number.toString()
    else invoiceNumber = invoice_number

    if (!isValidDate(date)) return res.status(400).json({detail: `The date ${date} is not valid, please provide it in the format YYYY-MM-DD`})

    const invoiceDate = new Date(date)
    const localOffset = new Date().getTimezoneOffset(); // in minutes
    const localOffsetMillis = 60 * 1000 * localOffset;
    const localMidnight = new Date(invoiceDate.getTime() + localOffsetMillis);
    // END OF DATA VALIDATION

    const updateData: invoiceUpdate = {
        invoice_number: invoiceNumber,
        date: localMidnight
    }

    const oneInvoiceResponse = await getOneInvoice(invoiceUUID, companyUUID)
    if (!oneInvoiceResponse) return res.status(404).json({detail: `Invoice with uuid: ${invoiceUUID} not found`})

    const updatedInvoiceResponse = await updateInvoice(updateData, oneInvoiceResponse)
    return res.status(updatedInvoiceResponse.status).json({detail: updatedInvoiceResponse.detail})
})

router.post("/:uuid/details", validateToken, validateUUID, async (req: Request, res: Response) => {
    const invoiceUUID = req.params.uuid
    const { userUUID, companyUUID } = res.locals.token 
    const { budgetItemUUID, quantity, cost } = req.body

    // DATA VALIDATION
    const invoice: Invoice | null = await getOneInvoice(invoiceUUID, companyUUID)
    if (!invoice) return res.status(404).json({detail: `Invoice with uuid: ${invoiceUUID} does not exist`})

    const user: User | null = await getOneUser(userUUID, companyUUID)
    if (!user) return res.status(404).json({detail: `Unable to find the logged in user`})

    const company: Company | null = await getCompany(companyUUID)
    if (!company) return res.status(404).json({detail: `Unable to find the logged in company`})

    if (!budgetItemUUID || !isValidUUID(budgetItemUUID)) return res.status(400).json({detail: `Invaild budget item uuid`})
    const budgetItem: BudgetItem | null = await getOneBudgetItemWithBudgetItemResponse(budgetItemUUID, companyUUID)
    if (!budgetItem) return res.status(404).json({detail: `Budget item with uuid ${budgetItemUUID} does not exist`})

    const project: Project = invoice.project

    const budget: Budget | null = await getBudgetByItemAndProject(budgetItemUUID, project.uuid, companyUUID)
    if (!budget) return res.status(404).json({detail: `No budget created for budget item ${budgetItem.name} in project ${project.name}`})

    if (!quantity || typeof quantity !== "number") return res.status(400).json({detail: `Invalid quantity, must be a numeric value`})
    if (!cost || typeof cost !== "number") return res.status(400).json({detail: `Invalid cost, must be a numeric value`})

    // END OF DATA VALIDATION

    const total: number = quantity * cost

    const invoiceDetailData = {
        budgetItem: budgetItem,
        quantity,
        cost, 
        total
    }
    
    const invoiceDetailResponse: errorType | successType = await createInvoiceDetail(invoiceDetailData, invoice, company, user, budget)

    return res.status(invoiceDetailResponse.status).json({detail: invoiceDetailResponse.detail})

})

router.get("/:uuid/details", validateToken, validateUUID, async (req: Request, res: Response) => {
    const invoiceUUID = req.params.uuid
    const { companyUUID } = res.locals.token 

    const invoiceDetailsData: InvoiceDetail[] = await getAllInvoiceDetaile(invoiceUUID, companyUUID)

    return res.status(200).json({detail: formatManyInvoiceDetailResponse(invoiceDetailsData)})
})

export default router