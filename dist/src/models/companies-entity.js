"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Company = void 0;
const typeorm_1 = require("typeorm");
const budget_entity_1 = require("./budget-entity");
const budget_items_entity_1 = require("./budget-items-entity");
const invoce_entity_1 = require("./invoce-entity");
const invoice_details_entity_1 = require("./invoice-details-entity");
const projects_entity_1 = require("./projects-entity");
const suppliers_entity_1 = require("./suppliers-entity");
const users_entity_1 = require("./users-entity");
let Company = class Company extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        type: 'uuid'
    }),
    __metadata("design:type", String)
], Company.prototype, "uuid", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Company.prototype, "ruc", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Company.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], Company.prototype, "employees", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: 'timestamptz'
    }),
    __metadata("design:type", Date)
], Company.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => users_entity_1.User, (user) => user.company),
    __metadata("design:type", Array)
], Company.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => suppliers_entity_1.Supplier, (supplier) => supplier.company),
    __metadata("design:type", Array)
], Company.prototype, "suppliers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => projects_entity_1.Project, (project) => project.company),
    __metadata("design:type", Array)
], Company.prototype, "projects", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => budget_items_entity_1.BudgetItem, (budgetItem) => budgetItem.company),
    __metadata("design:type", Array)
], Company.prototype, "budgetItems", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => budget_entity_1.Budget, (budget) => budget.company),
    __metadata("design:type", Array)
], Company.prototype, "budgets", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => invoce_entity_1.Invoice, (invoice) => invoice.company),
    __metadata("design:type", Array)
], Company.prototype, "invoices", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => invoice_details_entity_1.InvoiceDetail, (invoiceDetail) => invoiceDetail.company),
    __metadata("design:type", Array)
], Company.prototype, "invoiceDetails", void 0);
Company = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Unique)(["name"]),
    (0, typeorm_1.Unique)(["ruc"])
], Company);
exports.Company = Company;
