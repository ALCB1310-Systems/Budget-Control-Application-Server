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
exports.Project = void 0;
const typeorm_1 = require("typeorm");
const budget_entity_1 = require("./budget-entity");
const companies_entity_1 = require("./companies-entity");
const invoce_entity_1 = require("./invoce-entity");
const users_entity_1 = require("./users-entity");
let Project = class Project extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        type: "uuid"
    }),
    __metadata("design:type", String)
], Project.prototype, "uuid", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "character varying",
        length: 255
    }),
    __metadata("design:type", String)
], Project.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "boolean"
    }),
    __metadata("design:type", Boolean)
], Project.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => companies_entity_1.Company, (company) => company.projects),
    __metadata("design:type", Object)
], Project.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, (user) => user.projects),
    __metadata("design:type", Object)
], Project.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: 'timestamptz'
    }),
    __metadata("design:type", Date)
], Project.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => budget_entity_1.Budget, (budget) => budget.project),
    __metadata("design:type", Array)
], Project.prototype, "budgets", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => invoce_entity_1.Invoice, (invoice) => invoice.project),
    __metadata("design:type", Array)
], Project.prototype, "invoices", void 0);
Project = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Unique)(["company", "name"])
], Project);
exports.Project = Project;
