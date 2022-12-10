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
var BudgetItem_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetItem = void 0;
const typeorm_1 = require("typeorm");
const budget_entity_1 = require("./budget-entity");
const companies_entity_1 = require("./companies-entity");
const invoice_details_entity_1 = require("./invoice-details-entity");
const users_entity_1 = require("./users-entity");
let BudgetItem = BudgetItem_1 = class BudgetItem extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        type: "uuid"
    }),
    __metadata("design:type", String)
], BudgetItem.prototype, "uuid", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "character varying",
        length: 50
    }),
    __metadata("design:type", String)
], BudgetItem.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "character varying",
        length: 255
    }),
    __metadata("design:type", String)
], BudgetItem.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "boolean"
    }),
    __metadata("design:type", Boolean)
], BudgetItem.prototype, "accumulates", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "int"
    }),
    __metadata("design:type", Number)
], BudgetItem.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => BudgetItem_1, (budgetItem) => budgetItem.parent),
    __metadata("design:type", Array)
], BudgetItem.prototype, "childs", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => BudgetItem_1, (BudgetItem) => BudgetItem.childs, { nullable: true }),
    __metadata("design:type", Object)
], BudgetItem.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => companies_entity_1.Company, (company) => company.budgetItems, { nullable: false }),
    __metadata("design:type", companies_entity_1.Company)
], BudgetItem.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, (user) => user.budgetItems, { nullable: false }),
    __metadata("design:type", Object)
], BudgetItem.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: 'timestamptz'
    }),
    __metadata("design:type", Date)
], BudgetItem.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => budget_entity_1.Budget, (budget) => budget.budgetItem),
    __metadata("design:type", Array)
], BudgetItem.prototype, "budgets", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => invoice_details_entity_1.InvoiceDetail, (invoiceDetail) => invoiceDetail.budgetItem),
    __metadata("design:type", Array)
], BudgetItem.prototype, "invoiceDetails", void 0);
BudgetItem = BudgetItem_1 = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Unique)(["company", "code"]),
    (0, typeorm_1.Unique)(["company", "name"])
], BudgetItem);
exports.BudgetItem = BudgetItem;
