import dotenv from 'dotenv'

dotenv.config()

export const port = process.env.PORT || 5050

export const databaseHost: string = process.env.DATABASE_HOST!
export const databaseUsername: string = process.env.DATABASE_USERNAME!
export const databasePort: number = parseInt(process.env.DATABASE_PORT!)
export const databasePassword: string = process.env.DATABASE_PASSWORD!
export const databaseName: string = process.env.DATABASE_NAME!