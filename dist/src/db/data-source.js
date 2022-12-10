"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const environment_1 = require("./../../environment");
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const companies_entity_1 = require("../models/companies-entity");
const users_entity_1 = require("../models/users-entity");
const suppliers_entity_1 = require("../models/suppliers-entity");
const projects_entity_1 = require("../models/projects-entity");
const budget_items_entity_1 = require("../models/budget-items-entity");
const budget_entity_1 = require("../models/budget-entity");
const invoce_entity_1 = require("../models/invoce-entity");
const invoice_details_entity_1 = require("../models/invoice-details-entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: `postgres`,
    host: environment_1.databaseHost,
    port: environment_1.databasePort,
    username: environment_1.databaseUsername,
    password: environment_1.databasePassword,
    database: environment_1.databaseName,
    synchronize: true,
    entities: [
        companies_entity_1.Company,
        users_entity_1.User,
        suppliers_entity_1.Supplier,
        projects_entity_1.Project,
        budget_items_entity_1.BudgetItem,
        budget_entity_1.Budget,
        invoce_entity_1.Invoice,
        invoice_details_entity_1.InvoiceDetail
    ],
});
exports.AppDataSource.initialize();
