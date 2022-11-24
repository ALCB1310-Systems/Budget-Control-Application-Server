import { Supplier } from './../models/suppliers-entity';
import { validateUUID } from './../middleware/validateUuid';
import { formatOneSupplierResponse } from './../helpers/format';
import { successType, errorType } from './../types/responses-types';
import { User } from './../models/users-entity';
import { getOneUser } from '../controller/users-controller';
import { getCompany } from './../controller/companies-controller';
import { isEmailValid } from './../middleware/validateEmail';
import { validateToken } from './../middleware/validateToken';
import express, { Request, Response, Router } from "express";
import { Company } from '../models/companies-entity';
import { createSupplier, getAllSuppliers, getOneSupplier, updateSupplier } from '../controller/supplier-controller';

const router: Router = express.Router()

router.post("/", validateToken, async (req: Request, res: Response) => {
    const { companyUUID, userUUID } = res.locals.token

    const { supplier_id, name, contact_email } = req.body 

    // DATA VALIDATION

    if (!supplier_id) return res.status(400).json({detail: `You must provide the supplier's id`})
    if (!name) return res.status(400).json({detail: `You must provide the supplier's name`})

    if (contact_email && !isEmailValid(contact_email)) return res.status(400).json({detail: `You must provide a valid email`})

    const company: Company | null = await getCompany(companyUUID)
    if (!company) return res.status(404).json({detail: "Company not found"})

    const user: User | null = await getOneUser(userUUID, companyUUID)
    if (!user) return res.status(404).json({detail: `User not found`})

    // END OF DATA VALIDATION

    const createdSupplierResponse: errorType | successType = await createSupplier(req.body, company, user)

    if (createdSupplierResponse.status !== 201) return res.status(createdSupplierResponse.status).json({detail: createdSupplierResponse.detail})

    return res.status(createdSupplierResponse.status).json({detail: formatOneSupplierResponse(createdSupplierResponse.detail)})
})

router.get("/", validateToken, async (req: Request, res: Response) => {
    const { companyUUID } = res.locals.token

    const suppliers = await getAllSuppliers(companyUUID)

    return res.status(200).json({detail: suppliers})
})

router.get("/:uuid", validateToken, validateUUID, async (req: Request, res: Response) => {
    const { companyUUID } = res.locals.token
    const { uuid } = req.params
    
    const supplier: Supplier | null = await getOneSupplier(companyUUID, uuid)
    
    if (!supplier) return res.status(404).json({detail: `Supplier with uuid: ${uuid} does not exist`})
    
    return res.status(200).json({detail: supplier})
})

router.put("/:uuid", validateToken, validateUUID, async (req: Request, res: Response) => {
    const { companyUUID } = res.locals.token
    const { uuid } = req.params
    
    const supplier: Supplier | null = await getOneSupplier(companyUUID, uuid)
    
    if (!supplier) return res.status(404).json({detail: `Supplier with uuid: ${uuid} does not exist`})

    const updatedSupplierResponse = await updateSupplier(req.body, supplier)

    return res.status(updatedSupplierResponse.status).json({detail: updatedSupplierResponse.detail})
})

export default router