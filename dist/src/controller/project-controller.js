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
exports.updateProject = exports.getOneProject = exports.getAllProjects = exports.createProject = void 0;
const format_1 = require("./../helpers/format");
const uuid_1 = require("uuid");
const data_source_1 = require("../db/data-source");
const projects_entity_1 = require("../models/projects-entity");
const projectRepository = data_source_1.AppDataSource.getRepository(projects_entity_1.Project);
const queryRunner = data_source_1.AppDataSource.createQueryRunner();
const createProject = (newProject, company, user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield queryRunner.startTransaction();
        const project = new projects_entity_1.Project();
        project.uuid = (0, uuid_1.v4)();
        project.name = newProject.name;
        project.is_active = newProject.is_active;
        project.company = company;
        project.user = user;
        yield queryRunner.manager.save(project);
        yield queryRunner.commitTransaction();
        return { status: 201, detail: (0, format_1.formatOneProjectResponse)(project) };
    }
    catch (error) {
        yield queryRunner.rollbackTransaction();
        if (error.code !== undefined && error.code === '23505')
            return { status: 409, detail: `Project with name: "${newProject.name}" already exists` };
        console.error(error);
        return { status: 500, detail: `Unknown error, please check the logs` };
    }
});
exports.createProject = createProject;
const getAllProjects = (companyUUID) => __awaiter(void 0, void 0, void 0, function* () {
    const projects = projectRepository
        .createQueryBuilder("project")
        .select("project.uuid")
        .addSelect("project.name")
        .addSelect("project.is_active")
        .andWhere("project.companyUuid = :companyUUID")
        .setParameter("companyUUID", companyUUID)
        .orderBy("project.name")
        .getMany();
    return projects;
});
exports.getAllProjects = getAllProjects;
const getOneProject = (projectUUID, companyUUID) => __awaiter(void 0, void 0, void 0, function* () {
    const project = projectRepository
        .createQueryBuilder("project")
        .select("project.uuid")
        .addSelect("project.name")
        .addSelect("project.is_active")
        .andWhere("project.companyUuid = :companyUUID")
        .andWhere("project.uuid = :projectUUID")
        .setParameter("companyUUID", companyUUID)
        .setParameter("projectUUID", projectUUID)
        .orderBy("project.name")
        .getOne();
    return project;
});
exports.getOneProject = getOneProject;
const updateProject = (updateProjectInformation, projectToUpdate) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield queryRunner.startTransaction();
        projectToUpdate.name = updateProjectInformation.name ? updateProjectInformation.name : projectToUpdate.name;
        projectToUpdate.is_active = projectToUpdate.is_active !== undefined ? updateProjectInformation.is_active : projectToUpdate.is_active;
        yield queryRunner.manager.save(projectToUpdate);
        yield queryRunner.commitTransaction();
        return { status: 200, detail: projectToUpdate };
    }
    catch (error) {
        yield queryRunner.rollbackTransaction();
        if (error.code !== undefined && error.code === '23505')
            return { status: 409, detail: `Project with name: "${updateProjectInformation.name}" already exists` };
        console.error(error);
        return { status: 500, detail: `Unknown error, please check the logs` };
    }
});
exports.updateProject = updateProject;
