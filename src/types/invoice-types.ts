import { Supplier } from '../models/suppliers-entity';
import { Project } from './../models/projects-entity';

export type invoiceCreate = {
    project: Project,
    supplier: Supplier,
    invoice_number: string,
    date: Date
}