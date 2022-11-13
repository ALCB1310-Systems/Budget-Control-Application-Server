import { userResponse } from './../types/users-type';
import { Company } from "../models/companies-entity";
import { User } from "../models/users-entity";

export const formatManyUserResponse = (users: User[], company: Company): userResponse[] => {
    const formattedUser = users.map(user => {
        return formatOneUserResponse(user, company)
    })

    return formattedUser
}

export const formatOneUserResponse = (user: User, company: Company): userResponse => {
    return {
        uuid: user.uuid,
        email: user.email,
        name: user.name,
        company: company
    }
}