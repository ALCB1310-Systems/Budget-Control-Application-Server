import dotenv from 'dotenv'

dotenv.config()

export const port = process.env.PORT || 5050

export const databaseHost: string = <string>process.env.DATABASE_HOST
export const databaseUsername: string = <string>process.env.DATABASE_USERNAME
export const databasePort: number = parseInt(process.env.DATABASE_PORT!)
export const databasePassword: string = <string>process.env.DATABASE_PASSWORD
export const databaseName: string =<string>process.env.DATABASE_NAME

export const secretKey: string = <string>process.env.SECRET_KEY
