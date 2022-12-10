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
exports.getOneSupplierWithSupplierResponse = exports.updateSupplier = exports.getOneSupplier = exports.getAllSuppliers = exports.createSupplier = void 0;
const uuid_1 = require("uuid");
const data_source_1 = require("../db/data-source");
const suppliers_entity_1 = require("../models/suppliers-entity");
const supplierRepository = data_source_1.AppDataSource.getRepository(suppliers_entity_1.Supplier);
const queryRunner = data_source_1.AppDataSource.createQueryRunner();
const createSupplier = (newSupplier, company, user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield queryRunner.startTransaction();
        const supplierToCreate = new suppliers_entity_1.Supplier();
        supplierToCreate.uuid = (0, uuid_1.v4)();
        supplierToCreate.supplier_id = newSupplier.supplier_id;
        supplierToCreate.name = newSupplier.name;
        supplierToCreate.contact_email = newSupplier.contact_email;
        supplierToCreate.contact_name = newSupplier.contact_name;
        supplierToCreate.contact_phone = newSupplier.contact_phone;
        supplierToCreate.company = company;
        supplierToCreate.user = user;
        yield queryRunner.manager.save(supplierToCreate);
        yield queryRunner.commitTransaction();
        return { status: 201, detail: supplierToCreate };
    }
    catch (error) {
        yield queryRunner.rollbackTransaction();
        if (error.code !== undefined && error.code === '23505')
            return { status: 409, detail: `Supplier with id: "${newSupplier.supplier_id}" or name: "${newSupplier.name}" already exists` };
        console.error(error);
        return { status: 500, detail: `Unknown error, please check the logs` };
    }
});
exports.createSupplier = createSupplier;
const getAllSuppliers = (companyUUID) => __awaiter(void 0, void 0, void 0, function* () {
    const suppliers = yield supplierRepository
        .createQueryBuilder("supplier")
        .select("supplier.uuid")
        .addSelect("supplier.supplier_id")
        .addSelect("supplier.name")
        .addSelect("supplier.contact_name")
        .addSelect("supplier.contact_email")
        .addSelect("supplier.contact_phone")
        .andWhere("supplier.companyUuid = :companyUuid")
        .setParameter("companyUuid", companyUUID)
        .orderBy("supplier.name")
        .getMany();
    return suppliers;
});
exports.getAllSuppliers = getAllSuppliers;
const getOneSupplier = (companyUUID, supplierUUID) => __awaiter(void 0, void 0, void 0, function* () {
    const supplier = yield supplierRepository
        .createQueryBuilder("supplier")
        .select("supplier.uuid")
        .addSelect("supplier.supplier_id")
        .addSelect("supplier.name")
        .addSelect("supplier.contact_name")
        .addSelect("supplier.contact_email")
        .addSelect("supplier.contact_phone")
        .andWhere("supplier.companyUuid = :companyUuid")
        .andWhere("supplier.uuid = :supplierUUID")
        .setParameter("companyUuid", companyUUID)
        .setParameter("supplierUUID", supplierUUID)
        .orderBy("supplier.name")
        .getOne();
    return supplier;
});
exports.getOneSupplier = getOneSupplier;
const updateSupplier = (updatedSupplierInformation, supplierToUpdate) => __awaiter(void 0, void 0, void 0, function* () {
    supplierToUpdate.supplier_id = updatedSupplierInformation.supplier_id !== null ? updatedSupplierInformation.supplier_id : supplierToUpdate.supplier_id;
    supplierToUpdate.name = updatedSupplierInformation.name !== null ? updatedSupplierInformation.name : supplierToUpdate.name;
    supplierToUpdate.contact_name = updatedSupplierInformation.contact_name !== null ? updatedSupplierInformation.contact_name : supplierToUpdate.contact_name;
    supplierToUpdate.contact_email = updatedSupplierInformation.contact_email !== null ? updatedSupplierInformation.contact_email : supplierToUpdate.contact_email;
    supplierToUpdate.contact_phone = updatedSupplierInformation.contact_phone !== null ? updatedSupplierInformation.contact_phone : supplierToUpdate.contact_phone;
    try {
        yield queryRunner.startTransaction();
        yield queryRunner.manager.save(supplierToUpdate);
        yield queryRunner.commitTransaction();
        return { status: 200, detail: supplierToUpdate };
    }
    catch (error) {
        yield queryRunner.rollbackTransaction();
        if (error.code !== undefined && error.code === '23505')
            return { status: 409, detail: `Supplier with id: "${updatedSupplierInformation.supplier_id}" or name: "${updatedSupplierInformation.name}" already exists` };
        console.error(error);
        return { status: 500, detail: `Unknown error, please check the logs` };
    }
});
exports.updateSupplier = updateSupplier;
const getOneSupplierWithSupplierResponse = (supplierUUID, companyUUID) => __awaiter(void 0, void 0, void 0, function* () {
    const supplier = yield supplierRepository
        .createQueryBuilder("supplier")
        .andWhere("supplier.companyUuid = :companyUuid")
        .andWhere("supplier.uuid = :supplierUUID")
        .setParameter("companyUuid", companyUUID)
        .setParameter("supplierUUID", supplierUUID)
        .orderBy("supplier.name")
        .getOne();
    return supplier;
});
exports.getOneSupplierWithSupplierResponse = getOneSupplierWithSupplierResponse;
