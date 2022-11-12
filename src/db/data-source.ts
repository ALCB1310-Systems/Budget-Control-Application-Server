import "reflect-metadata"
import { DataSource } from "typeorm"
import { Company } from "../models/companies-entity"

export const AppDataSource: DataSource = new DataSource({
    type: `postgres`,
    host: `localhost`,
    port: 5432,
    username: `andresc`,
    password: `a1s2d3fr`,
    database: `bca`,
    synchronize: true,
    entities: [
        Company
    ],
})

AppDataSource.initialize()