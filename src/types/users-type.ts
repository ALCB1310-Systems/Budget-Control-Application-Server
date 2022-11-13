import { Company } from "../models/companies-entity";

export type userCreate = {
    email: string,
    password: string,
    name: string
    company: Company
}

export type userResponse = {
    email: string,
    name: string,
    company: Company
}