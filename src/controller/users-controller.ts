import { QueryRunner } from 'typeorm';
import { v4 } from "uuid"
import { User } from "../models/users-entity"
import { AppDataSource } from "../db/data-source"
import { userCreate } from "../types/users-type"
import { hashPassword } from '../middleware/passwordHashing';

const userRepository = AppDataSource.getRepository(User)

export const saveUser =async (newUser:userCreate, queryRunner: QueryRunner) => {
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