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
exports.Invoice = void 0;
const companies_entity_1 = require("./companies-entity");
const typeorm_1 = require("typeorm");
const users_entity_1 = require("./users-entity");
const projects_entity_1 = require("./projects-entity");
const suppliers_entity_1 = require("./suppliers-entity");
const invoice_details_entity_1 = require("./invoice-details-entity");
let Invoice = class Invoice extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        type: "uuid"
    }),
    __metadata("design:type", String)
], Invoice.prototype, "uuid", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => companies_entity_1.Company, (company) => company.invoices),
    __metadata("design:type", Object)
], Invoice.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, (user) => user.invoices),
    __metadata("design:type", Object)
], Invoice.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => projects_entity_1.Project, (project) => project.invoices),
    __metadata("design:type", Object)
], Invoice.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => suppliers_entity_1.Supplier, (supplier) => supplier.invoices),
    __metadata("design:type", Object)
], Invoice.prototype, "supplier", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'character varying',
        length: 255
    }),
    __metadata("design:type", String)
], Invoice.prototype, "invoice_number", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'date'
    }),
    __metadata("design:type", Date)
], Invoice.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'float'
    }),
    __metadata("design:type", Number)
], Invoice.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: 'timestamptz'
    }),
    __metadata("design:type", Date)
], Invoice.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => invoice_details_entity_1.InvoiceDetail, (invoiceDetail) => invoiceDetail.invoice),
    __metadata("design:type", Array)
], Invoice.prototype, "invoiceDetails", void 0);
Invoice = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Unique)(["company", "supplier", "invoice_number"])
], Invoice);
exports.Invoice = Invoice;
