import { tokenData } from './../types/login-type';
import { debug } from 'console';
import { isValidDate } from './../helpers/dateValidation';
import { Company } from './../models/companies-entity';
import { getOneSupplierWithSupplierResponse } from './../controller/supplier-controller';
import { invoiceCreate } from './../types/invoice-types';
import { getOneProject } from './../controller/project-controller';
import { validateToken } from './../middleware/validateToken';
import { Request, Response, Router } from "express";
import { isValidUUID } from '../middleware/validateUuid';
import { Supplier } from '../models/suppliers-entity';
import { Project } from '../models/projects-entity';
import { getCompany } from '../controller/companies-controller';
import { User } from '../models/users-entity';
import { getOneUser } from '../controller/users-controller';
import { createInvoice, getAllInvoices } from '../controller/invoice-controller';

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

    // END OF DATA VALIDATION
    const invoiceToCreate: invoiceCreate = {
        project: selectedProject,
        supplier: selectedSupplier,
        invoice_number: invoiceNumber,
        date: invoiceDate
    }

    const createdInvoiceResponse = await createInvoice(invoiceToCreate, company, user)

    return res.status(createdInvoiceResponse.status).json({detail: createdInvoiceResponse.detail})
})

router.get("/", validateToken, async (req: Request, res: Response) => {
    const { companyUUID } = res.locals.token
    const projectName  = req.query.project?.toString()

    const invoices = await getAllInvoices(companyUUID, projectName)

    return res.status(200).json({detail: invoices})
})

export default router