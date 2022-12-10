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
exports.InvoiceDetail = void 0;
const typeorm_1 = require("typeorm");
const budget_items_entity_1 = require("./budget-items-entity");
const companies_entity_1 = require("./companies-entity");
const invoce_entity_1 = require("./invoce-entity");
const users_entity_1 = require("./users-entity");
let InvoiceDetail = class InvoiceDetail extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        type: "uuid"
    }),
    __metadata("design:type", String)
], InvoiceDetail.prototype, "uuid", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => companies_entity_1.Company, (company) => company.invoiceDetails),
    __metadata("design:type", Object)
], InvoiceDetail.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, (user) => user.invoiceDetails),
    __metadata("design:type", Object)
], InvoiceDetail.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => invoce_entity_1.Invoice, (invoice) => invoice.invoiceDetails),
    __metadata("design:type", Object)
], InvoiceDetail.prototype, "invoice", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => budget_items_entity_1.BudgetItem, (budgetItem) => budgetItem.invoiceDetails),
    __metadata("design:type", Object)
], InvoiceDetail.prototype, "budgetItem", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "float"
    }),
    __metadata("design:type", Number)
], InvoiceDetail.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "float"
    }),
    __metadata("design:type", Number)
], InvoiceDetail.prototype, "cost", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "float"
    }),
    __metadata("design:type", Number)
], InvoiceDetail.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: 'timestamptz'
    }),
    __metadata("design:type", Date)
], InvoiceDetail.prototype, "created_at", void 0);
InvoiceDetail = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Unique)(["company", "invoice", "budgetItem"])
], InvoiceDetail);
exports.InvoiceDetail = InvoiceDetail;
