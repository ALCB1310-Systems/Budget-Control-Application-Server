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
exports.Budget = void 0;
const typeorm_1 = require("typeorm");
const budget_items_entity_1 = require("./budget-items-entity");
const companies_entity_1 = require("./companies-entity");
const projects_entity_1 = require("./projects-entity");
const users_entity_1 = require("./users-entity");
let Budget = class Budget extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        type: "uuid"
    }),
    __metadata("design:type", String)
], Budget.prototype, "uuid", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, (user) => user.budgets),
    __metadata("design:type", Object)
], Budget.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => companies_entity_1.Company, (company) => company.budgets),
    __metadata("design:type", Object)
], Budget.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => budget_items_entity_1.BudgetItem, (budgetItem) => budgetItem.budgets),
    __metadata("design:type", Object)
], Budget.prototype, "budgetItem", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => projects_entity_1.Project, (project) => project.budgets),
    __metadata("design:type", Object)
], Budget.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "float",
        nullable: true
    }),
    __metadata("design:type", Object)
], Budget.prototype, "initial_quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "float",
        nullable: true
    }),
    __metadata("design:type", Object)
], Budget.prototype, "initial_cost", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "float"
    }),
    __metadata("design:type", Number)
], Budget.prototype, "initial_total", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "float",
        nullable: true
    }),
    __metadata("design:type", Object)
], Budget.prototype, "spent_quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "float"
    }),
    __metadata("design:type", Number)
], Budget.prototype, "spent_total", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "float",
        nullable: true
    }),
    __metadata("design:type", Object)
], Budget.prototype, "to_spend_quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "float",
        nullable: true
    }),
    __metadata("design:type", Object)
], Budget.prototype, "to_spend_cost", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "float"
    }),
    __metadata("design:type", Number)
], Budget.prototype, "to_spend_total", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "float"
    }),
    __metadata("design:type", Number)
], Budget.prototype, "updated_budget", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: 'timestamptz'
    }),
    __metadata("design:type", Date)
], Budget.prototype, "created_at", void 0);
Budget = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Unique)(["company", "budgetItem", "project"])
], Budget);
exports.Budget = Budget;
