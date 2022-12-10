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
exports.updateCompany = exports.getCompany = exports.createCompany = void 0;
const companies_entity_1 = require("./../models/companies-entity");
const users_controller_1 = require("./users-controller");
const data_source_1 = require("../db/data-source");
const uuid_1 = require("uuid");
const companyRepository = data_source_1.AppDataSource.getRepository(companies_entity_1.Company);
const queryRunner = data_source_1.AppDataSource.createQueryRunner();
const createCompany = (newCompany) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield queryRunner.startTransaction();
        const company = new companies_entity_1.Company();
        company.uuid = (0, uuid_1.v4)();
        company.name = newCompany.name;
        company.ruc = newCompany.ruc;
        company.employees = newCompany.employees;
        yield queryRunner.manager.save(company);
        const userData = {
            company: company,
            email: newCompany.email,
            password: newCompany.password,
            name: newCompany.fullname,
        };
        yield (0, users_controller_1.saveUser)(userData, queryRunner);
        yield queryRunner.commitTransaction();
        return { status: 201, detail: company };
    }
    catch (error) {
        yield queryRunner.rollbackTransaction();
        if (error.code !== undefined && error.code === '23505' && error.table === 'company')
            return { status: 409, detail: `Company with name: "${newCompany.name} "or ruc: "${newCompany.ruc}" already exists` };
        if (error.code !== undefined && error.code === '23505' && error.table === 'user')
            return { status: 409, detail: `User with name: "${newCompany.fullname} "or email: "${newCompany.email}" already exists` };
        if (error.code !== undefined && error.code === 'alcb1')
            return { status: 400, detail: JSON.parse(error.message) };
        console.error(error);
        return { status: 500, detail: `Something went wrong check the server's logs` };
    }
});
exports.createCompany = createCompany;
const getCompany = (companyUUID) => __awaiter(void 0, void 0, void 0, function* () {
    return companyRepository.createQueryBuilder("company")
        .select("company.uuid")
        .addSelect("company.ruc")
        .addSelect("company.name")
        .addSelect("company.employees")
        .where("company.uuid = :uuid")
        .setParameter("uuid", companyUUID)
        .getOne();
});
exports.getCompany = getCompany;
const updateCompany = (updatedData, existingCompany) => __awaiter(void 0, void 0, void 0, function* () {
    existingCompany.ruc = updatedData.ruc;
    existingCompany.name = updatedData.name;
    existingCompany.employees = updatedData.employees;
    try {
        yield companyRepository.save(existingCompany);
        return { status: 200, detail: existingCompany };
    }
    catch (error) {
        if (error.code !== undefined && error.code === '23505' && error.table === 'company')
            return { status: 409, detail: `Company with name: "${updatedData.name} "or ruc: "${updatedData.ruc}" already exists` };
        console.error(error);
        return { status: 500, detail: `Something went wrong check the server's logs` };
    }
});
exports.updateCompany = updateCompany;
