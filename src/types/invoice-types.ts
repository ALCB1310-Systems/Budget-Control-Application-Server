import { Supplier } from '../models/suppliers-entity';
import { Project } from './../models/projects-entity';

export type invoiceCreate = {
    project: Project,
    supplier: Supplier,
    invoice_number: string,
    date: Date
}

export type invoiceUpdate = {
    invoice_number: string | null | undefined,
    date: Date | null | undefined
}

export type invoiceResponse = {
    uuid: string,
    invoice_number: string,
    date: Date,
    project: {
        uuid: string,
        name: string,
        active: boolean
    },
    supplier: {
        uuid: string,
        supplier_id: string,
        name: string,
        contact_name: string | null,
        contact_email: string | null,
        contact_phone: string | null
    }
}