"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatManyInvoiceDetailResponse = exports.formatOneInvoiceDetailResponse = exports.formatOneInvoiceResponse = exports.formatManyInvoicesResponse = exports.formatOneBudgetResponse = exports.formatManyBudgetResponse = exports.formatManyBudgetItemsResponse = exports.formatGetOneBudgetItemResponse = exports.formatOneBudgetItemResponse = exports.formatOneProjectResponse = exports.formatOneSupplierResponse = exports.formatOneUserResponse = exports.formatManyUserResponse = void 0;
const formatManyUserResponse = (users, company) => {
    const formattedUser = users.map(user => {
        return (0, exports.formatOneUserResponse)(user, company);
    });
    return formattedUser;
};
exports.formatManyUserResponse = formatManyUserResponse;
const formatOneUserResponse = (user, company) => {
    return {
        uuid: user.uuid,
        email: user.email,
        name: user.name,
        company: company
    };
};
exports.formatOneUserResponse = formatOneUserResponse;
const formatOneSupplierResponse = (supplier) => {
    return {
        uuid: supplier.uuid,
        supplier_id: supplier.supplier_id,
        name: supplier.name,
        contact_name: supplier.contact_name,
        contact_email: supplier.contact_email,
        contact_phone: supplier.contact_phone
    };
};
exports.formatOneSupplierResponse = formatOneSupplierResponse;
const formatOneProjectResponse = (project) => {
    return {
        uuid: project.uuid,
        name: project.name,
        is_active: project.is_active
    };
};
exports.formatOneProjectResponse = formatOneProjectResponse;
const formatOneBudgetItemResponse = (budgetItem) => {
    var _a;
    return {
        uuid: budgetItem.uuid,
        code: budgetItem.code,
        name: budgetItem.name,
        accumulates: budgetItem.accumulates,
        level: budgetItem.level,
        parentUuid: (_a = budgetItem.parent) === null || _a === void 0 ? void 0 : _a.uuid
    };
};
exports.formatOneBudgetItemResponse = formatOneBudgetItemResponse;
const formatGetOneBudgetItemResponse = (budgetItem) => {
    let parent = null;
    if (budgetItem.parent)
        parent = {
            uuid: budgetItem.parent.uuid,
            code: budgetItem.parent.code,
            name: budgetItem.parent.name,
            accumulates: budgetItem.parent.accumulates,
            level: budgetItem.parent.level,
            parentUuid: null
        };
    return {
        uuid: budgetItem.uuid,
        code: budgetItem.code,
        name: budgetItem.name,
        accumulates: budgetItem.accumulates,
        level: budgetItem.level,
        parent
    };
};
exports.formatGetOneBudgetItemResponse = formatGetOneBudgetItemResponse;
const formatManyBudgetItemsResponse = (budgetItems) => {
    const formattedBudgetItems = budgetItems.map(budgetItem => (0, exports.formatGetOneBudgetItemResponse)(budgetItem));
    return formattedBudgetItems;
};
exports.formatManyBudgetItemsResponse = formatManyBudgetItemsResponse;
const formatManyBudgetResponse = (budgets) => {
    const formattedBudget = budgets.map(budget => (0, exports.formatOneBudgetResponse)(budget));
    return formattedBudget;
};
exports.formatManyBudgetResponse = formatManyBudgetResponse;
const formatOneBudgetResponse = (budget) => {
    const budget_item = (0, exports.formatGetOneBudgetItemResponse)(budget.budgetItem);
    const project = (0, exports.formatOneProjectResponse)(budget.project);
    const budgetResponse = {
        uuid: budget.uuid,
        initial_quantity: budget.initial_quantity,
        initial_cost: budget.initial_cost,
        initial_total: budget.initial_total,
        spent_quantity: budget.spent_quantity,
        spent_total: budget.spent_total,
        to_spend_quantity: budget.to_spend_quantity,
        to_spend_cost: budget.to_spend_cost,
        to_spend_total: budget.to_spend_total,
        updated_budget: budget.updated_budget,
        budget_item,
        project
    };
    return budgetResponse;
};
exports.formatOneBudgetResponse = formatOneBudgetResponse;
const formatManyInvoicesResponse = (invoices) => {
    return invoices.map(invoice => (0, exports.formatOneInvoiceResponse)(invoice));
};
exports.formatManyInvoicesResponse = formatManyInvoicesResponse;
const formatOneInvoiceResponse = (invoice) => {
    return {
        uuid: invoice.uuid,
        invoice_number: invoice.invoice_number,
        date: invoice.date,
        total: invoice.total,
        project: {
            uuid: invoice.project.uuid,
            name: invoice.project.name,
            active: invoice.project.is_active
        },
        supplier: {
            uuid: invoice.supplier.uuid,
            supplier_id: invoice.supplier.supplier_id,
            name: invoice.supplier.name,
            contact_name: invoice.supplier.contact_name,
            contact_email: invoice.supplier.contact_email,
            contact_phone: invoice.supplier.contact_phone
        }
    };
};
exports.formatOneInvoiceResponse = formatOneInvoiceResponse;
const formatOneInvoiceDetailResponse = (invoiceDetail) => {
    return {
        uuid: invoiceDetail.uuid,
        quantity: invoiceDetail.quantity,
        cost: invoiceDetail.cost,
        total: invoiceDetail.total,
        budgetItem: {
            uuid: invoiceDetail.budgetItem.uuid,
            code: invoiceDetail.budgetItem.code,
            name: invoiceDetail.budgetItem.name
        },
        invoice: {
            uuid: invoiceDetail.invoice.uuid,
            invoice_number: invoiceDetail.invoice.invoice_number,
            total: invoiceDetail.invoice.total,
            date: invoiceDetail.invoice.date,
            supplier: {
                uuid: invoiceDetail.invoice.supplier.uuid,
                name: invoiceDetail.invoice.supplier.name,
                contact_name: invoiceDetail.invoice.supplier.contact_name,
                contact_email: invoiceDetail.invoice.supplier.contact_email,
                contact_phone: invoiceDetail.invoice.supplier.contact_phone
            },
            project: {
                uuid: invoiceDetail.invoice.project.uuid,
                name: invoiceDetail.invoice.project.name
            }
        }
    };
};
exports.formatOneInvoiceDetailResponse = formatOneInvoiceDetailResponse;
const formatManyInvoiceDetailResponse = (invoiceDetails) => {
    return invoiceDetails.map(invoiceDetail => (0, exports.formatOneInvoiceDetailResponse)(invoiceDetail));
};
exports.formatManyInvoiceDetailResponse = formatManyInvoiceDetailResponse;
