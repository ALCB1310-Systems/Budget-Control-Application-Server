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
exports.saveBudgetWithSpent = exports.getBudgetByItemAndProject = exports.getOneBudgetWithBudgetResponse = exports.updateBudget = exports.getOneBudget = exports.getAllBudgets = exports.createNewBudget = void 0;
const format_1 = require("./../helpers/format");
const budget_items_controller_1 = require("./budget-items-controller");
const budget_entity_1 = require("./../models/budget-entity");
const data_source_1 = require("../db/data-source");
const uuid_1 = require("uuid");
const budgetRepository = data_source_1.AppDataSource.getRepository(budget_entity_1.Budget);
const queryRunner = data_source_1.AppDataSource.createQueryRunner();
const createNewBudget = (newBudget) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield queryRunner.startTransaction();
        const budget = new budget_entity_1.Budget();
        budget.uuid = (0, uuid_1.v4)();
        budget.user = newBudget.user;
        budget.company = newBudget.company;
        budget.project = newBudget.project;
        budget.budgetItem = newBudget.budgetItem;
        budget.initial_total = newBudget.total;
        budget.spent_total = 0;
        budget.to_spend_total = newBudget.total;
        budget.updated_budget = newBudget.total;
        budget.initial_quantity = newBudget.quantity;
        budget.initial_cost = newBudget.cost;
        budget.spent_quantity = 0;
        budget.to_spend_quantity = newBudget.quantity;
        budget.to_spend_cost = newBudget.cost;
        yield queryRunner.manager.save(budget);
        if (newBudget.budgetItem.parent) {
            const budgetItem = yield (0, budget_items_controller_1.getOneBudgetItem)(newBudget.budgetItem.parent.uuid, newBudget.company.uuid);
            if (!budgetItem)
                throw new Error("Unknown project");
            newBudget.budgetItem = budgetItem.detail;
            yield saveNewBudget(newBudget, queryRunner);
        }
        yield queryRunner.commitTransaction();
        return { status: 201, detail: budget };
    }
    catch (error) {
        yield queryRunner.rollbackTransaction();
        if (error.code === '23505')
            return { status: 409, detail: `Budget for item ${newBudget.budgetItem.name} in project ${newBudget.project.name} already exists` };
        console.error(error);
        return { status: 500, detail: "An error occurred, check your logs" };
    }
});
exports.createNewBudget = createNewBudget;
const saveNewBudget = (newBudget, queryRunner) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const budgetToCreate = yield budgetExists(newBudget, false);
        if (!budgetToCreate) {
            // need to create the budget
            const budget = new budget_entity_1.Budget();
            budget.uuid = (0, uuid_1.v4)();
            budget.user = newBudget.user;
            budget.company = newBudget.company;
            budget.project = newBudget.project;
            budget.budgetItem = newBudget.budgetItem;
            budget.initial_total = newBudget.total;
            budget.spent_total = 0;
            budget.to_spend_total = newBudget.total;
            budget.updated_budget = newBudget.total;
            yield queryRunner.manager.save(budget);
        }
        else {
            // need to update the budget
            budgetToCreate.initial_total += newBudget.total;
            budgetToCreate.to_spend_total += newBudget.total;
            budgetToCreate.updated_budget += newBudget.total;
            yield queryRunner.manager.save(budgetToCreate);
        }
        if (newBudget.budgetItem.parent) {
            const budgetItem = yield (0, budget_items_controller_1.getOneBudgetItem)(newBudget.budgetItem.parent.uuid, newBudget.company.uuid);
            if (!budgetItem)
                throw new Error("Unknown project");
            newBudget.budgetItem = budgetItem.detail;
            saveNewBudget(newBudget, queryRunner);
        }
    }
    catch (error) {
        console.error(error);
        throw new Error(error);
    }
});
const budgetExists = (budgetData, deb) => __awaiter(void 0, void 0, void 0, function* () {
    const budget = yield budgetRepository
        .createQueryBuilder("budget")
        .andWhere("budget.companyUuid = :company")
        .andWhere("budget.projectUuid = :project")
        .andWhere("budget.budgetItemUuid = :budgetItem")
        .setParameter("company", budgetData.company.uuid)
        .setParameter("project", budgetData.project.uuid)
        .setParameter("budgetItem", budgetData.budgetItem.uuid)
        .getOne();
    return budget;
});
const getAllBudgets = (companyUUID, projectUUID = null) => __awaiter(void 0, void 0, void 0, function* () {
    let budgets = budgetRepository
        .createQueryBuilder("budget")
        .leftJoinAndSelect("budget.project", "project")
        .leftJoinAndSelect("budget.budgetItem", "budgetItem")
        .leftJoinAndSelect("budgetItem.parent", "parent")
        .andWhere("budget.companyUuid = :company")
        .setParameter("company", companyUUID);
    if (projectUUID) {
        budgets = budgets.andWhere("project.name = :project")
            .setParameter("project", projectUUID);
    }
    const budgetsResults = yield budgets
        .addOrderBy("project.name")
        .addOrderBy("budgetItem.code")
        .getMany();
    return budgetsResults;
});
exports.getAllBudgets = getAllBudgets;
const getOneBudget = (budgetUUID, companyUUID) => __awaiter(void 0, void 0, void 0, function* () {
    let budget = yield budgetRepository
        .createQueryBuilder("budget")
        .leftJoinAndSelect("budget.project", "project")
        .leftJoinAndSelect("budget.budgetItem", "budgetItem")
        .leftJoinAndSelect("budgetItem.parent", "parent")
        .andWhere("budget.companyUuid = :company")
        .andWhere("budget.uuid = :uuid")
        .setParameter("company", companyUUID)
        .setParameter("uuid", budgetUUID)
        .getOne();
    if (!budget)
        return { status: 404, detail: `Budget with uuid ${budgetUUID} does not exist` };
    return { status: 200, detail: (0, format_1.formatOneBudgetResponse)(budget) };
});
exports.getOneBudget = getOneBudget;
const updateBudget = (updatedInfo, budgetToUpdate, companyUUID) => __awaiter(void 0, void 0, void 0, function* () {
    const diff = updatedInfo.total - budgetToUpdate.to_spend_total;
    if (!diff)
        return { status: 500, detail: 'Error saving data, got not a number in difference ' };
    try {
        yield queryRunner.startTransaction();
        budgetToUpdate.to_spend_quantity = updatedInfo.quantity;
        budgetToUpdate.to_spend_cost = updatedInfo.cost;
        budgetToUpdate.to_spend_total = diff + budgetToUpdate.to_spend_total;
        budgetToUpdate.updated_budget = budgetToUpdate.spent_total + budgetToUpdate.to_spend_total;
        queryRunner.manager.save(budgetToUpdate);
        if (budgetToUpdate.budgetItem.parent) {
            const nextBudget = yield (0, exports.getBudgetByItemAndProject)(budgetToUpdate.budgetItem.parent.uuid, budgetToUpdate.project.uuid, companyUUID);
            if (!nextBudget)
                throw new Error("No budget found for parent, check logs");
            yield updateParentBudget(diff, nextBudget, companyUUID, queryRunner);
        }
        yield queryRunner.commitTransaction();
        return { status: 200, detail: budgetToUpdate };
    }
    catch (error) {
        yield queryRunner.rollbackTransaction();
        if (error.code === '23505')
            return { status: 409, detail: `Budget for item ${budgetToUpdate.budgetItem.name} in project ${budgetToUpdate.project.name} already exists` };
        console.error(error);
        return { status: 500, detail: "An error occurred, check your logs" };
    }
});
exports.updateBudget = updateBudget;
const updateParentBudget = (diff, budget, companyUUID, queryRunner) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        budget.to_spend_total += diff;
        budget.updated_budget = budget.spent_total + budget.to_spend_total;
        queryRunner.manager.save(budget);
        if (budget.budgetItem.parent) {
            const nextBudget = yield (0, exports.getBudgetByItemAndProject)(budget.budgetItem.parent.uuid, budget.project.uuid, companyUUID);
            if (!nextBudget)
                throw new Error("No budget found for parent, check logs");
            yield updateParentBudget(diff, nextBudget, companyUUID, queryRunner);
        }
    }
    catch (error) {
        console.error(error);
        throw new Error(error);
    }
});
const getOneBudgetWithBudgetResponse = (budgetUUID, companyUUID) => __awaiter(void 0, void 0, void 0, function* () {
    let budget = yield budgetRepository
        .createQueryBuilder("budget")
        .leftJoinAndSelect("budget.project", "project")
        .leftJoinAndSelect("budget.budgetItem", "budgetItem")
        .leftJoinAndSelect("budgetItem.parent", "parent")
        .leftJoinAndSelect("budget.company", "company")
        .andWhere("budget.companyUuid = :company")
        .andWhere("budget.uuid = :uuid")
        .setParameter("company", companyUUID)
        .setParameter("uuid", budgetUUID)
        .getOne();
    return budget;
});
exports.getOneBudgetWithBudgetResponse = getOneBudgetWithBudgetResponse;
const getBudgetByItemAndProject = (budgetItemUUID, projectUUID, companyUUID) => __awaiter(void 0, void 0, void 0, function* () {
    let budget = yield budgetRepository
        .createQueryBuilder("budget")
        .leftJoinAndSelect("budget.project", "project")
        .leftJoinAndSelect("budget.budgetItem", "budgetItem")
        .leftJoinAndSelect("budgetItem.parent", "parent")
        .leftJoinAndSelect("budget.company", "company")
        .andWhere("budget.companyUuid = :company")
        .andWhere("budgetItem.uuid = :budgetItemUuid")
        .andWhere("project.uuid = :project")
        .setParameter("company", companyUUID)
        .setParameter("budgetItemUuid", budgetItemUUID)
        .setParameter("project", projectUUID)
        .getOne();
    return budget;
});
exports.getBudgetByItemAndProject = getBudgetByItemAndProject;
const saveBudgetWithSpent = (total, diff, budget, queryRunner) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        budget.spent_total += total;
        budget.to_spend_total += total + diff;
        budget.updated_budget = budget.spent_total + budget.to_spend_total;
        yield queryRunner.manager.save(budget);
        if (budget.budgetItem.parent) {
            const nextBudget = yield (0, exports.getBudgetByItemAndProject)(budget.budgetItem.parent.uuid, budget.project.uuid, budget.company.uuid);
            if (nextBudget)
                yield (0, exports.saveBudgetWithSpent)(total, diff, nextBudget, queryRunner);
        }
        return true;
    }
    catch (error) {
        console.error(error);
        throw new Error(error);
    }
});
exports.saveBudgetWithSpent = saveBudgetWithSpent;
