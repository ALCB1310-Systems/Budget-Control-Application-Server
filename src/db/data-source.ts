import { databaseUsername, databasePort, databaseHost, databasePassword, databaseName } from './../../environment';
import "reflect-metadata"
import { DataSource } from "typeorm"
import { Company } from "../models/companies-entity"
import { User } from "../models/users-entity";
import { Supplier } from '../models/suppliers-entity';

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
        Supplier
    ],
})

AppDataSource.initialize()