"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllInvoiceDetaile = exports.createInvoiceDetail = void 0;
const data_source_1 = require("../db/data-source");
const invoice_details_entity_1 = require("../models/invoice-details-entity");
const uuid_1 = require("uuid");
const budget_controller_1 = require("./budget-controller");
const invoiceDetailRepository = data_source_1.AppDataSource.getRepository(invoice_details_entity_1.InvoiceDetail);
const queryRunner = data_source_1.AppDataSource.createQueryRunner();
const createInvoiceDetail = (invoiceDetailData, invoice, company, user, budget) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield queryRunner.startTransaction();
        const invoiceDetail = new invoice_details_entity_1.InvoiceDetail();
        invoiceDetail.uuid = (0, uuid_1.v4)();
        invoiceDetail.company = company;
        invoiceDetail.user = user;
        invoiceDetail.invoice = invoice;
        invoiceDetail.budgetItem = invoiceDetailData.budgetItem;
        invoiceDetail.quantity = invoiceDetailData.quantity;
        invoiceDetail.cost = invoiceDetailData.cost;
        invoiceDetail.total = invoiceDetailData.total;
        yield queryRunner.manager.save(invoiceDetail);
        invoice.total += invoiceDetailData.total;
        yield queryRunner.manager.save(invoice);
        const previousUpdatedBudget = budget.updated_budget;
        if (budget.spent_quantity === null || budget.to_spend_quantity === null)
            return { status: 400, detail: `The budget you are trying to update does not have a quantity` };
        budget.spent_quantity += invoiceDetailData.quantity;
        budget.spent_total += invoiceDetailData.total;
        budget.to_spend_cost = invoiceDetailData.cost;
        budget.to_spend_quantity -= invoiceDetailData.quantity;
        budget.to_spend_total = budget.to_spend_quantity * budget.to_spend_cost;
        budget.updated_budget = budget.spent_total + budget.to_spend_total;
        yield queryRunner.manager.save(budget);
        const diff = budget.updated_budget - previousUpdatedBudget;
        if (budget.budgetItem.parent) {
            const nextBudget = yield (0, budget_controller_1.getBudgetByItemAndProject)(budget.budgetItem.parent.uuid, budget.project.uuid, company.uuid);
            if (nextBudget)
                yield (0, budget_controller_1.saveBudgetWithSpent)(invoiceDetailData.total, diff, nextBudget, queryRunner);
        }
        yield queryRunner.commitTransaction();
        return { status: 201, detail: invoiceDetail };
    }
    catch (error) {
        yield queryRunner.rollbackTransaction();
        if (error.code = '23505')
            return { status: 409, detail: `The invoice has already have the budget item ${invoiceDetailData.budgetItem.name}` };
        console.error(error);
        return { status: 500, detail: 'Something went wrong, please check your logs' };
    }
});
exports.createInvoiceDetail = createInvoiceDetail;
const getAllInvoiceDetaile = (invoiceUUID, companyUUID) => __awaiter(void 0, void 0, void 0, function* () {
    const invoiceDetails = invoiceDetailRepository.createQueryBuilder("detail")
        .leftJoinAndSelect("detail.budgetItem", "budgetItem")
        .leftJoinAndSelect("detail.invoice", "invoice")
        .leftJoinAndSelect("invoice.supplier", "supplier")
        .leftJoinAndSelect("invoice.project", "project")
        .andWhere("detail.companyUuid = :companyUUID")
        .andWhere("detail.invoiceUuid = :invoiceUUID")
        .setParameter("companyUUID", companyUUID)
        .setParameter("invoiceUUID", invoiceUUID)
        .getMany();
    return invoiceDetails;
});
exports.getAllInvoiceDetaile = getAllInvoiceDetaile;
