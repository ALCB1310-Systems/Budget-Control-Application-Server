
import bcrypt from 'bcrypt'

export const hashPassword = async (plainPassword: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10)
    
    const returnPassword = await bcrypt.hash(plainPassword, salt)

    return returnPassword
}

export const verifyPassword = async (plainPassword: string, hashedPassword: string) => {
    return await bcrypt.compare(plainPassword, hashedPassword)
}