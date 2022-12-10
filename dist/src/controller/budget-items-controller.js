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
exports.updateBudgetItem = exports.getOneBudgetItemWithBudgetItemResponse = exports.getOneBudgetItem = exports.getAllBudgetItems = exports.createBudgetItem = void 0;
const companies_controller_1 = require("./companies-controller");
const format_1 = require("./../helpers/format");
const uuid_1 = require("uuid");
const data_source_1 = require("../db/data-source");
const budget_items_entity_1 = require("../models/budget-items-entity");
const budgetItemRepository = data_source_1.AppDataSource.getRepository(budget_items_entity_1.BudgetItem);
const queryRunner = data_source_1.AppDataSource.createQueryRunner();
const createBudgetItem = (newBudgetItem, company, user) => __awaiter(void 0, void 0, void 0, function* () {
    const budgetItem = new budget_items_entity_1.BudgetItem();
    budgetItem.uuid = (0, uuid_1.v4)();
    budgetItem.code = newBudgetItem.code;
    budgetItem.name = newBudgetItem.name;
    budgetItem.accumulates = newBudgetItem.accumulates;
    budgetItem.level = newBudgetItem.level;
    budgetItem.parent = newBudgetItem.parentUuid ? yield getParentBudgetItem(newBudgetItem.parentUuid, company) : null;
    budgetItem.company = company;
    budgetItem.user = user;
    try {
        yield queryRunner.startTransaction();
        yield queryRunner.manager.save(budgetItem);
        yield queryRunner.commitTransaction();
        return { status: 201, detail: (0, format_1.formatOneBudgetItemResponse)(budgetItem) };
    }
    catch (error) {
        yield queryRunner.rollbackTransaction();
        if (error.code !== undefined && error.code === '23505')
            return { status: 409, detail: `Budget item with code: "${newBudgetItem.code}" or name: "${newBudgetItem.name}" already exists` };
        console.error(error);
        return { status: 500, detail: `Unknown error, please check the logs` };
    }
});
exports.createBudgetItem = createBudgetItem;
const getAllBudgetItems = (companyUuid) => __awaiter(void 0, void 0, void 0, function* () {
    const company = yield (0, companies_controller_1.getCompany)(companyUuid);
    if (!company)
        throw new Error("couldn't get the company");
    const budgetItems = yield budgetItemRepository
        .createQueryBuilder("budgetItem")
        .leftJoinAndSelect("budgetItem.parent", "parent")
        .andWhere("budgetItem.companyUuid = :companyUuid")
        .setParameter("companyUuid", companyUuid)
        .getMany();
    const formattedBudgetItems = (0, format_1.formatManyBudgetItemsResponse)(budgetItems);
    return formattedBudgetItems;
});
exports.getAllBudgetItems = getAllBudgetItems;
const getOneBudgetItem = (budgetItemUuid, companyUuid) => __awaiter(void 0, void 0, void 0, function* () {
    const company = yield (0, companies_controller_1.getCompany)(companyUuid);
    if (!company)
        throw new Error("couldn't get the company");
    const budgetItem = yield budgetItemRepository
        .createQueryBuilder("budgetItem")
        .leftJoinAndSelect("budgetItem.parent", "parent")
        .andWhere("budgetItem.companyUuid = :companyUuid")
        .andWhere("budgetItem.uuid = :budgetItemUuid")
        .setParameter("companyUuid", companyUuid)
        .setParameter("budgetItemUuid", budgetItemUuid)
        .getOne();
    if (!budgetItem)
        return { status: 404, detail: `No budget item with uuid: ${budgetItemUuid}` };
    return { status: 200, detail: budgetItem };
});
exports.getOneBudgetItem = getOneBudgetItem;
const getOneBudgetItemWithBudgetItemResponse = (budgetItemUuid, companyUuid) => __awaiter(void 0, void 0, void 0, function* () {
    const company = yield (0, companies_controller_1.getCompany)(companyUuid);
    if (!company)
        throw new Error("couldn't get the company");
    const budgetItem = yield budgetItemRepository
        .createQueryBuilder("budgetItem")
        .leftJoinAndSelect("budgetItem.parent", "parent")
        .andWhere("budgetItem.companyUuid = :companyUuid")
        .andWhere("budgetItem.uuid = :budgetItemUuid")
        .setParameter("companyUuid", companyUuid)
        .setParameter("budgetItemUuid", budgetItemUuid)
        .getOne();
    return budgetItem;
});
exports.getOneBudgetItemWithBudgetItemResponse = getOneBudgetItemWithBudgetItemResponse;
const getParentBudgetItem = (parentUUID, company) => __awaiter(void 0, void 0, void 0, function* () {
    const budgetItem = yield budgetItemRepository
        .createQueryBuilder("budgetItem")
        .select("budgetItem.uuid")
        .addSelect("budgetItem.code")
        .addSelect("budgetItem.name")
        .addSelect("budgetItem.accumulates")
        .addSelect("budgetItem.level")
        .addSelect("budgetItem.parentUuid")
        .andWhere("budgetItem.uuid = :uuid")
        .andWhere("budgetItem.companyUuid = :companyUuid")
        .setParameter("uuid", parentUUID)
        .setParameter("companyUuid", company.uuid)
        .getOne();
    return budgetItem;
});
const updateBudgetItem = (updatedBudgetItemInformation, budgetItemToUpdate, company) => __awaiter(void 0, void 0, void 0, function* () {
    budgetItemToUpdate.code = updatedBudgetItemInformation.code ? updatedBudgetItemInformation.code : budgetItemToUpdate.code;
    budgetItemToUpdate.name = updatedBudgetItemInformation.name ? updatedBudgetItemInformation.name : budgetItemToUpdate.name;
    budgetItemToUpdate.accumulates = updatedBudgetItemInformation.accumulates === undefined ? updatedBudgetItemInformation.accumulates : budgetItemToUpdate.accumulates;
    budgetItemToUpdate.level = updatedBudgetItemInformation.level ? updatedBudgetItemInformation.level : budgetItemToUpdate.level;
    const parentBudget = updatedBudgetItemInformation.parentUuid ? yield getParentBudgetItem(updatedBudgetItemInformation.parentUuid, company) : budgetItemToUpdate.parent;
    budgetItemToUpdate.parent = parentBudget;
    try {
        yield queryRunner.startTransaction();
        yield queryRunner.manager.save(budgetItemToUpdate);
        yield queryRunner.commitTransaction();
        return { status: 200, detail: (0, format_1.formatOneBudgetItemResponse)(budgetItemToUpdate) };
    }
    catch (error) {
        yield queryRunner.rollbackTransaction();
        if (error.code !== undefined && error.code === '23505')
            return { status: 409, detail: `Budget item with code: "${budgetItemToUpdate.code}" or name: "${budgetItemToUpdate.name}" already exists` };
        console.error(error);
        return { status: 500, detail: `Unknown error, please check the logs` };
    }
});
exports.updateBudgetItem = updateBudgetItem;
