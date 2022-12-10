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
const validateUuid_1 = require("./../middleware/validateUuid");
const format_1 = require("./../helpers/format");
const budget_controller_1 = require("./../controller/budget-controller");
const project_controller_1 = require("./../controller/project-controller");
const companies_controller_1 = require("./../controller/companies-controller");
const users_controller_1 = require("./../controller/users-controller");
const validateToken_1 = require("../middleware/validateToken");
const express_1 = require("express");
const budget_items_controller_1 = require("../controller/budget-items-controller");
const budget_validator_1 = require("../validators/budget-validator");
const router = (0, express_1.Router)();
router.post("/", validateToken_1.validateToken, (0, dataValidation_1.validateData)(budget_validator_1.budgetCreateValidator), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userUUID, companyUUID } = res.locals.token;
    const { budget_item_id, project_id, quantity, cost } = req.body;
    // DATA VALIDATION
    const user = yield (0, users_controller_1.getOneUser)(userUUID, companyUUID);
    if (!user)
        return res.status(404).json({ detail: "You are logged in with an unknown user" });
    const company = yield (0, companies_controller_1.getCompany)(companyUUID);
    if (!company)
        return res.status(404).json({ detail: "You are logged in with an unknown company" });
    const budget_item = yield (0, budget_items_controller_1.getOneBudgetItem)(budget_item_id, companyUUID);
    if (!budget_item)
        return res.status(404).json({ detail: `Budget item with uuid ${budget_item_id} not found` });
    const project = yield (0, project_controller_1.getOneProject)(project_id, companyUUID);
    if (!project)
        return res.status(404).json({ detail: `Project with uuid ${project_id} not found` });
    // END OF DATA VALIDATION
    const total = quantity * cost;
    const newBudget = { quantity, cost, total, budgetItem: budget_item.detail, project, user, company };
    const newBudgetResponse = yield (0, budget_controller_1.createNewBudget)(newBudget);
    return res.status(newBudgetResponse.status).json({ detail: newBudgetResponse.detail });
}));
router.get("/", validateToken_1.validateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyUUID } = res.locals.token;
    const project = req.query.project;
    if (project && typeof project !== 'string')
        return res.status(400).json({ detail: `Project name is not valid` });
    // if (project && !isValidUUID(project)) return res.status(400).json({detail: `Project uuid is not valid`})
    const budgets = yield (0, budget_controller_1.getAllBudgets)(companyUUID, project);
    const formattedBudget = (0, format_1.formatManyBudgetResponse)(budgets);
    return res.status(200).json({ detail: formattedBudget });
}));
router.get("/:uuid", validateToken_1.validateToken, validateUuid_1.validateUUID, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyUUID } = res.locals.token;
    const budgetUUID = req.params.uuid;
    const budget = yield (0, budget_controller_1.getOneBudget)(budgetUUID, companyUUID);
    return res.status(budget.status).json({ detail: budget.detail });
}));
router.put("/:uuid", validateToken_1.validateToken, validateUuid_1.validateUUID, (0, dataValidation_1.validateData)(budget_validator_1.updateBudgetValidator), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyUUID } = res.locals.token;
    const budgetUUID = req.params.uuid;
    const { quantity, cost } = req.body;
    const total = quantity * cost;
    const updateBudgetInfo = { quantity, cost, total };
    const budget = yield (0, budget_controller_1.getOneBudgetWithBudgetResponse)(budgetUUID, companyUUID);
    if (!budget)
        return res.status(404).json({ detail: `Budget with uuid: ${budgetUUID} does not exist` });
    const updateBudgetResponse = yield (0, budget_controller_1.updateBudget)(updateBudgetInfo, budget, companyUUID);
    return res.status(updateBudgetResponse.status).json({ detail: updateBudgetResponse.detail });
}));
exports.default = router;
