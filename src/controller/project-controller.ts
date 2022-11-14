import { formatOneProjectResponse } from './../helpers/format';
import { errorType, successType } from './../types/responses-types';
import { Repository, QueryRunner } from 'typeorm';
import { v4 } from 'uuid';
import { AppDataSource } from "../db/data-source";
import { Company } from '../models/companies-entity';
import { Project } from "../models/projects-entity";
import { User } from '../models/users-entity';
import { projectCreate, projectResponse } from '../types/project-type';

const projectRepository: Repository<Project> = AppDataSource.getRepository(Project)
const queryRunner: QueryRunner = AppDataSource.createQueryRunner()

export const createProject = async (newProject: projectCreate, company: Company, user: User):Promise<errorType | successType> => {
    const project: Project = new Project()

    project.uuid = v4()
    project.name = newProject.name
    project.is_active = newProject.is_active
    project.company = company
    project.user = user

    try {
        await queryRunner.startTransaction()

        await queryRunner.manager.save(project)

        await queryRunner.commitTransaction()

        return {status: 201, detail: formatOneProjectResponse(project)}
    } catch (error: any) {
        await queryRunner.rollbackTransaction()
        if (error.code !== undefined && error.code === '23505') return { status: 409, detail: `Project with name: "${newProject.name}" already exists`}

        console.error(error);

        return {status: 500, detail: `Unknown error, please check the logs`}
    }
}

export const getAllProjects = async (companyUUID: string): Promise<projectResponse[]> => {
    const projects = projectRepository
        .createQueryBuilder("project")
        .select("project.uuid")
        .addSelect("project.name")
        .addSelect("project.is_active")
        .andWhere("project.companyUuid = :companyUUID")
        .setParameter("companyUUID", companyUUID)
        .orderBy("project.name")
        .getMany()

    return projects
}

export const getOneProject = async (projectUUID: string, companyUUID: string): Promise<projectResponse | null> => {
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
        .getOne()
    
    return project
}

export const updateProject = async (updateProjectInformation: projectCreate, projectToUpdate: projectResponse): Promise<errorType|successType> => {
    projectToUpdate.name = updateProjectInformation.name ? updateProjectInformation.name : projectToUpdate.name
    projectToUpdate.is_active = projectToUpdate.is_active !== undefined ? updateProjectInformation.is_active : projectToUpdate.is_active

    try {
        await queryRunner.startTransaction()

        await queryRunner.manager.save(projectToUpdate)

        await queryRunner.commitTransaction()

        return {status: 201, detail: projectToUpdate}
    } catch (error: any) {
        await queryRunner.rollbackTransaction()
        if (error.code !== undefined && error.code === '23505') return { status: 409, detail: `Project with name: "${updateProjectInformation.name}" already exists`}

        console.error(error);

        return {status: 500, detail: `Unknown error, please check the logs`}
    }
}