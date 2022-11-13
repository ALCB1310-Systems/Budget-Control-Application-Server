import { QueryRunner } from 'typeorm';
import { v4 } from "uuid"
import { User } from "../models/users-entity"
import { AppDataSource } from "../db/data-source"
import { userCreate } from "../types/users-type"
import { hashPassword } from '../middleware/passwordHashing';
import { Company } from '../models/companies-entity';
import { errorType, successType } from '../types/responses-types';

const userRepository = AppDataSource.getRepository(User)
const queryRunner: QueryRunner = AppDataSource.createQueryRunner()

export const saveUser = async (newUser:userCreate, queryRunner: QueryRunner) => {
    const user = new User()

    user.uuid = v4()
    user.email = newUser.email
    user.name = newUser.name
    user.company = newUser.company
    
    try {
        user.password = await hashPassword(newUser.password)
        await queryRunner.manager.save(user)

        return user
    } catch (error) {
        throw error
    }
}

export const createUser = async (newUser:userCreate): Promise<successType | errorType> => {
    try {
        await queryRunner.startTransaction()

        const user = await saveUser(newUser, queryRunner)

        await queryRunner.commitTransaction()

        return {status: 201, detail: user}
    } catch (error: any) {
        await queryRunner.rollbackTransaction()
         if (error.code !== undefined && error.code === '23505') return { status: 409, detail: `User with email: "${newUser.email}" already exists`}

         console.error(error)
         return {status: 500, detail: `Unknown error, please check the logs`}
    }
}

export const getTotalUsers = async (company: Company) => {
    const { totalUsers } = await userRepository
    .createQueryBuilder("user")
    .select("COUNT(user.email)", "totalUsers")
    .where("user.companyUuid = :companyUuid")
    .setParameter('companyUuid', company.uuid)
    .getRawOne()
    
    return totalUsers
}

export const getAllUsers =async (companyUuid:string): Promise<User[]> => {
    const users = await userRepository
        .createQueryBuilder("user")
        .select("user.uuid")
        .addSelect("user.email")
        .addSelect("user.name")
        .andWhere("user.companyUuid = :companyUuid")
        .setParameter("companyUuid", companyUuid)
        .orderBy("user.name")
        .getMany()

    return users
}

export const getOneUser =async (userUuid:string, companyUuid: string): Promise<User|null> => {
    const user = await userRepository
        .createQueryBuilder("user")
        .select("user.uuid")
        .addSelect("user.email")
        .addSelect("user.name")
        .andWhere("user.companyUuid = :companyUuid")
        .andWhere("user.uuid = :userUuid")
        .setParameter("companyUuid", companyUuid)
        .setParameter("userUuid", userUuid)
        .orderBy("user.name")
        .getOne()

    return user
}