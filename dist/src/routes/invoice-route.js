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
const dataValidation_1 = require("./../middleware/dataValidation");
const budget_controller_1 = require("./../controller/budget-controller");
const budget_items_controller_1 = require("./../controller/budget-items-controller");
const invoice_details_controller_1 = require("../controller/invoice-details-controller");
const validateUuid_1 = require("./../middleware/validateUuid");
const format_1 = require("./../helpers/format");
const supplier_controller_1 = require("./../controller/supplier-controller");
const project_controller_1 = require("./../controller/project-controller");
const validateToken_1 = require("./../middleware/validateToken");
const express_1 = require("express");
const companies_controller_1 = require("../controller/companies-controller");
const users_controller_1 = require("../controller/users-controller");
const invoice_controller_1 = require("../controller/invoice-controller");
const invoice_validator_1 = require("../validators/invoice-validator");
const invoice_details_validator_1 = require("../validators/invoice-details-validator");
const router = (0, express_1.Router)();
router.post("/", validateToken_1.validateToken, (0, dataValidation_1.validateData)(invoice_validator_1.createInvoiceValidator), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyUUID, userUUID } = res.locals.token;
    const { supplier, project, invoice_number, date } = req.body;
    // DATA VALIDATION}
    const selectedSupplier = yield (0, supplier_controller_1.getOneSupplierWithSupplierResponse)(supplier, companyUUID);
    if (!selectedSupplier)
        return res.status(404).json({ detail: `Supplier with uuid: ${supplier} does not exist` });
    const selectedProject = yield (0, project_controller_1.getOneProject)(project, companyUUID);
    if (!selectedProject)
        return res.status(404).json({ detail: `Project with uuid: ${project} does not exist` });
    const company = yield (0, companies_controller_1.getCompany)(companyUUID);
    if (!company)
        return res.status(404).json({ detail: `Could not get the company you are logged in as` });
    const user = yield (0, users_controller_1.getOneUser)(userUUID, companyUUID);
    if (!user)
        return res.status(404).json({ detail: `Could not get the user your are logged in as` });
    const invoiceDate = new Date(date);
    const localOffset = new Date().getTimezoneOffset(); // in minutes
    const localOffsetMillis = 60 * 1000 * localOffset;
    const localMidnight = new Date(invoiceDate.getTime() + localOffsetMillis);
    // END OF DATA VALIDATION
    const invoiceToCreate = {
        project: selectedProject,
        supplier: selectedSupplier,
        invoice_number,
        date: localMidnight
    };
    const createdInvoiceResponse = yield (0, invoice_controller_1.createInvoice)(invoiceToCreate, company, user);
    return res.status(createdInvoiceResponse.status).json({ detail: createdInvoiceResponse.detail });
}));
router.get("/", validateToken_1.validateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { companyUUID } = res.locals.token;
    const projectName = (_a = req.query.project) === null || _a === void 0 ? void 0 : _a.toString();
    const invoices = yield (0, invoice_controller_1.getAllInvoices)(companyUUID, projectName);
    return res.status(200).json({ detail: (0, format_1.formatManyInvoicesResponse)(invoices) });
}));
router.get("/:uuid", validateToken_1.validateToken, validateUuid_1.validateUUID, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyUUID } = res.locals.token;
    const { uuid } = req.params;
    const oneInvoiceResponse = yield (0, invoice_controller_1.getOneInvoice)(uuid, companyUUID);
    if (!oneInvoiceResponse)
        return res.status(404).json({ detail: `Invoice with uuid: ${uuid} not found` });
    return res.status(200).json({ detail: (0, format_1.formatOneInvoiceResponse)(oneInvoiceResponse) });
}));
router.put("/:uuid", validateToken_1.validateToken, validateUuid_1.validateUUID, (0, dataValidation_1.validateData)(invoice_validator_1.updateInvoiceValidator), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyUUID } = res.locals.token;
    const invoiceUUID = req.params.uuid;
    const { invoice_number, date } = req.body;
    // DATA VALIDATION
    const invoiceDate = new Date(date);
    const localOffset = new Date().getTimezoneOffset(); // in minutes
    const localOffsetMillis = 60 * 1000 * localOffset;
    const localMidnight = new Date(invoiceDate.getTime() + localOffsetMillis);
    // END OF DATA VALIDATION
    const updateData = {
        invoice_number,
        date: localMidnight
    };
    const oneInvoiceResponse = yield (0, invoice_controller_1.getOneInvoice)(invoiceUUID, companyUUID);
    if (!oneInvoiceResponse)
        return res.status(404).json({ detail: `Invoice with uuid: ${invoiceUUID} not found` });
    const updatedInvoiceResponse = yield (0, invoice_controller_1.updateInvoice)(updateData, oneInvoiceResponse);
    return res.status(updatedInvoiceResponse.status).json({ detail: updatedInvoiceResponse.detail });
}));
router.post("/:uuid/details", validateToken_1.validateToken, validateUuid_1.validateUUID, (0, dataValidation_1.validateData)(invoice_details_validator_1.invoiceDetailCreateValidator), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const invoiceUUID = req.params.uuid;
    const { userUUID, companyUUID } = res.locals.token;
    const { budgetItemUUID, quantity, cost } = req.body;
    // DATA VALIDATION
    const invoice = yield (0, invoice_controller_1.getOneInvoice)(invoiceUUID, companyUUID);
    if (!invoice)
        return res.status(404).json({ detail: `Invoice with uuid: ${invoiceUUID} does not exist` });
    const user = yield (0, users_controller_1.getOneUser)(userUUID, companyUUID);
    if (!user)
        return res.status(404).json({ detail: `Unable to find the logged in user` });
    const company = yield (0, companies_controller_1.getCompany)(companyUUID);
    if (!company)
        return res.status(404).json({ detail: `Unable to find the logged in company` });
    const budgetItem = yield (0, budget_items_controller_1.getOneBudgetItemWithBudgetItemResponse)(budgetItemUUID, companyUUID);
    if (!budgetItem)
        return res.status(404).json({ detail: `Budget item with uuid ${budgetItemUUID} does not exist` });
    const project = invoice.project;
    const budget = yield (0, budget_controller_1.getBudgetByItemAndProject)(budgetItemUUID, project.uuid, companyUUID);
    if (!budget)
        return res.status(404).json({ detail: `No budget created for budget item ${budgetItem.name} in project ${project.name}` });
    // END OF DATA VALIDATION
    const total = quantity * cost;
    const invoiceDetailData = {
        budgetItem: budgetItem,
        quantity,
        cost,
        total
    };
    const invoiceDetailResponse = yield (0, invoice_details_controller_1.createInvoiceDetail)(invoiceDetailData, invoice, company, user, budget);
    return res.status(invoiceDetailResponse.status).json({ detail: invoiceDetailResponse.detail });
}));
router.get("/:uuid/details", validateToken_1.validateToken, validateUuid_1.validateUUID, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const invoiceUUID = req.params.uuid;
    const { companyUUID } = res.locals.token;
    const invoiceDetailsData = yield (0, invoice_details_controller_1.getAllInvoiceDetail)(invoiceUUID, companyUUID);
    return res.status(200).json({ detail: (0, format_1.formatManyInvoiceDetailResponse)(invoiceDetailsData) });
}));
router.delete("/:uuid/details/:detail", validateToken_1.validateToken, validateUuid_1.validateUUID, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uuid, detail } = req.params;
    const { companyUUID } = res.locals.token;
    if (yield (0, invoice_details_controller_1.deleteInvoiceDetail)(uuid, detail, companyUUID))
        return res.sendStatus(204);
    return res.sendStatus(500);
}));
exports.default = router;
