import { databaseUsername, databasePort, databaseHost, databasePassword, databaseName } from './../../environment';
import "reflect-metadata"
import { DataSource } from "typeorm"
import { Company } from "../models/companies-entity"
import { User } from "../models/users-entity";
import { Supplier } from '../models/suppliers-entity';
import { Project } from '../models/projects-entity';
import { BudgetItem } from '../models/budget-items-entity';
import { Budget } from '../models/budget-entity';
import { Invoice } from '../models/invoce-entity';
import { InvoiceDetail } from '../models/invoice-details-entity';

export const AppDataSource: DataSource = new DataSource({
    type: `postgres`,
    host: databaseHost,
    port: databasePort,
    username: databaseUsername,
    password: databasePassword,
    database: databaseName,
    synchronize: true,
    entities: [
        Company,
        User, 
        Supplier,
        Project,
        BudgetItem,
        Budget,
        Invoice,
        InvoiceDetail
    ],
})

AppDataSource.initialize()