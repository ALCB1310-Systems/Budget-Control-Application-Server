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
exports.updateUser = exports.getOneUser = exports.getAllUsers = exports.getTotalUsers = exports.createUser = exports.saveUser = void 0;
const uuid_1 = require("uuid");
const users_entity_1 = require("../models/users-entity");
const data_source_1 = require("../db/data-source");
const passwordHashing_1 = require("../middleware/passwordHashing");
const userRepository = data_source_1.AppDataSource.getRepository(users_entity_1.User);
const queryRunner = data_source_1.AppDataSource.createQueryRunner();
const saveUser = (newUser, queryRunner) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new users_entity_1.User();
    user.uuid = (0, uuid_1.v4)();
    user.email = newUser.email;
    user.name = newUser.name;
    user.company = newUser.company;
    try {
        user.password = yield (0, passwordHashing_1.hashPassword)(newUser.password);
        yield queryRunner.manager.save(user);
        return user;
    }
    catch (error) {
        throw error;
    }
});
exports.saveUser = saveUser;
const createUser = (newUser) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield queryRunner.startTransaction();
        const user = yield (0, exports.saveUser)(newUser, queryRunner);
        yield queryRunner.commitTransaction();
        return { status: 201, detail: user };
    }
    catch (error) {
        yield queryRunner.rollbackTransaction();
        if (error.code !== undefined && error.code === '23505')
            return { status: 409, detail: `User with email: "${newUser.email}" already exists` };
        console.error(error);
        return { status: 500, detail: `Unknown error, please check the logs` };
    }
});
exports.createUser = createUser;
const getTotalUsers = (company) => __awaiter(void 0, void 0, void 0, function* () {
    const { totalUsers } = yield userRepository
        .createQueryBuilder("user")
        .select("COUNT(user.email)", "totalUsers")
        .where("user.companyUuid = :companyUuid")
        .setParameter('companyUuid', company.uuid)
        .getRawOne();
    return totalUsers;
});
exports.getTotalUsers = getTotalUsers;
const getAllUsers = (companyUuid) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userRepository
        .createQueryBuilder("user")
        .select("user.uuid")
        .addSelect("user.email")
        .addSelect("user.name")
        .andWhere("user.companyUuid = :companyUuid")
        .setParameter("companyUuid", companyUuid)
        .orderBy("user.name")
        .getMany();
    return users;
});
exports.getAllUsers = getAllUsers;
const getOneUser = (userUuid, companyUuid) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userRepository
        .createQueryBuilder("user")
        .select("user.uuid")
        .addSelect("user.email")
        .addSelect("user.name")
        .andWhere("user.companyUuid = :companyUuid")
        .andWhere("user.uuid = :userUuid")
        .setParameter("companyUuid", companyUuid)
        .setParameter("userUuid", userUuid)
        .orderBy("user.name")
        .getOne();
    return user;
});
exports.getOneUser = getOneUser;
const updateUser = (updatedUserInformation, userToUpdate) => __awaiter(void 0, void 0, void 0, function* () {
    userToUpdate.email = updatedUserInformation.email ? updatedUserInformation.email : userToUpdate.email;
    userToUpdate.name = updatedUserInformation.name ? updatedUserInformation.name : userToUpdate.name;
    if (updatedUserInformation.password)
        userToUpdate.password = yield (0, passwordHashing_1.hashPassword)(updatedUserInformation.password);
    try {
        yield queryRunner.startTransaction();
        const user = yield queryRunner.manager.save(userToUpdate);
        yield queryRunner.commitTransaction();
        return { status: 200, detail: user };
    }
    catch (error) {
        yield queryRunner.rollbackTransaction();
        if (error.code !== undefined && error.code === '23505')
            return { status: 409, detail: `User with email: "${updatedUserInformation.email}" already exists` };
        console.error(error);
        return { status: 500, detail: `Unknown error, please check the logs` };
    }
});
exports.updateUser = updateUser;
