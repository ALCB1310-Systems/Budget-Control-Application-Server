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
exports.updateInvoice = exports.getOneInvoice = exports.getAllInvoices = exports.createInvoice = void 0;
const format_1 = require("./../helpers/format");
const data_source_1 = require("../db/data-source");
const invoce_entity_1 = require("../models/invoce-entity");
const uuid_1 = require("uuid");
const invoiceRepository = data_source_1.AppDataSource.getRepository(invoce_entity_1.Invoice);
const queryRunner = data_source_1.AppDataSource.createQueryRunner();
const createInvoice = (invoiceToCreate, company, user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield queryRunner.startTransaction();
        const newInvoice = new invoce_entity_1.Invoice();
        newInvoice.uuid = (0, uuid_1.v4)();
        newInvoice.company = company;
        newInvoice.user = user;
        newInvoice.project = invoiceToCreate.project;
        newInvoice.supplier = invoiceToCreate.supplier;
        newInvoice.invoice_number = invoiceToCreate.invoice_number;
        newInvoice.date = invoiceToCreate.date;
        newInvoice.total = 0;
        yield queryRunner.manager.save(newInvoice);
        yield queryRunner.commitTransaction();
        return { status: 201, detail: (0, format_1.formatOneInvoiceResponse)(newInvoice) };
    }
    catch (error) {
        yield queryRunner.rollbackTransaction();
        if (error.code === '23505')
            return { status: 409, detail: `Invoice for supplier ${invoiceToCreate.supplier.name} with number ${invoiceToCreate.invoice_number} already exists` };
        console.error(error);
        return { status: 500, detail: `Something went wrong please check your logs` };
    }
});
exports.createInvoice = createInvoice;
const getAllInvoices = (companyUUID, projectName = undefined) => __awaiter(void 0, void 0, void 0, function* () {
    const invoicesQuery = invoiceRepository.createQueryBuilder('invoice')
        .leftJoinAndSelect('invoice.project', 'project')
        .leftJoinAndSelect('invoice.supplier', 'supplier')
        .andWhere("invoice.companyUuid = :companyUuid")
        .setParameter("companyUuid", companyUUID);
    if (projectName) {
        invoicesQuery.andWhere('lower(project.name) = :projectName')
            .setParameter('projectName', projectName.trim().toLowerCase());
    }
    const invoices = yield invoicesQuery
        .addOrderBy('project.name')
        .addOrderBy('invoice.date')
        .addOrderBy('supplier.name')
        .addOrderBy('invoice.invoice_number')
        .getMany();
    return invoices;
});
exports.getAllInvoices = getAllInvoices;
const getOneInvoice = (invoiceUUID, companyUUID) => __awaiter(void 0, void 0, void 0, function* () {
    const invoice = yield invoiceRepository.createQueryBuilder('invoice')
        .leftJoinAndSelect('invoice.project', 'project')
        .leftJoinAndSelect('invoice.supplier', 'supplier')
        .andWhere("invoice.companyUuid = :companyUuid")
        .andWhere("invoice.uuid = :uuid")
        .setParameter("companyUuid", companyUUID)
        .setParameter("uuid", invoiceUUID)
        .getOne();
    return invoice;
});
exports.getOneInvoice = getOneInvoice;
const updateInvoice = (updatedInfo, invoiceToUpdate) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield queryRunner.startTransaction();
        invoiceToUpdate.invoice_number = updatedInfo.invoice_number || invoiceToUpdate.invoice_number;
        invoiceToUpdate.date = updatedInfo.date || invoiceToUpdate.date;
        yield queryRunner.manager.save(invoiceToUpdate);
        yield queryRunner.commitTransaction();
        return { status: 200, detail: (0, format_1.formatOneInvoiceResponse)(invoiceToUpdate) };
    }
    catch (error) {
        yield queryRunner.rollbackTransaction();
        console.error(error);
        return { status: 500, detail: "Unknwon error please check your logs" };
    }
});
exports.updateInvoice = updateInvoice;
