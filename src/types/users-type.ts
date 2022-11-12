import { Company } from "../models/companies-entity";

export type userCreate = {
    email: string,
    password: string,
    name: string
    company: Company
}