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
const budget_items_controller_1 = require("./../controller/budget-items-controller");
const users_controller_1 = require("./../controller/users-controller");
const validateToken_1 = require("./../middleware/validateToken");
const express_1 = require("express");
const companies_controller_1 = require("../controller/companies-controller");
const budget_item_validator_1 = require("../validators/budget-item-validator");
const router = (0, express_1.Router)();
router.post("/", validateToken_1.validateToken, (0, dataValidation_1.validateData)(budget_item_validator_1.createBudgetItemValidator), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userUUID, companyUUID } = res.locals.token;
    // DATA VALIDATION BEGIN
    const company = yield (0, companies_controller_1.getCompany)(companyUUID);
    if (!company)
        return res.status(404).json({ detail: `No company found with your logged in information` });
    const user = yield (0, users_controller_1.getOneUser)(userUUID, companyUUID);
    if (!user)
        return res.status(404).json({ detail: `No user found with your logged in information` });
    // DATA VALIDATION END
    const newBudgetItemResponse = yield (0, budget_items_controller_1.createBudgetItem)(req.body, company, user);
    return res.status(newBudgetItemResponse.status).json({ detail: newBudgetItemResponse.detail });
}));
router.get("/", validateToken_1.validateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyUUID } = res.locals.token;
    const budgetItemsResponseData = yield (0, budget_items_controller_1.getAllBudgetItems)(companyUUID);
    return res.status(200).json({ detail: budgetItemsResponseData });
}));
router.get("/:uuid", validateToken_1.validateToken, validateUuid_1.validateUUID, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyUUID } = res.locals.token;
    const budgetItemUUID = req.params.uuid;
    const budgetItemResponseData = yield (0, budget_items_controller_1.getOneBudgetItem)(budgetItemUUID, companyUUID);
    return res.status(budgetItemResponseData.status).json({ detail: budgetItemResponseData.detail });
}));
router.put("/:uuid", validateToken_1.validateToken, validateUuid_1.validateUUID, (0, dataValidation_1.validateData)(budget_item_validator_1.updateBudgetItemValidator), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyUUID } = res.locals.token;
    const budgetItemUUID = req.params.uuid;
    const company = yield (0, companies_controller_1.getCompany)(companyUUID);
    if (!company)
        return res.status(404).json({ detail: "Company not found" });
    const budgetItemToUpdate = yield (0, budget_items_controller_1.getOneBudgetItem)(budgetItemUUID, companyUUID);
    if (budgetItemToUpdate.status !== 200)
        return res.status(budgetItemToUpdate.status).json({ detail: budgetItemToUpdate.detail });
    const updatedBudgetItemResponse = yield (0, budget_items_controller_1.updateBudgetItem)(req.body, budgetItemToUpdate.detail, company);
    return res.status(updatedBudgetItemResponse.status).json({ detail: updatedBudgetItemResponse.detail });
}));
exports.default = router;
