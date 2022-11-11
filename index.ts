import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import { Console } from 'console';

dotenv.config()

const app: Express = express()

const port = process.env.PORT || 5050

app.get('/', (req: Request, res: Response) => {
    res.send('Hello BCA with Express + Typescript Server')
})

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})