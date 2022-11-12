import express, { Express, Request, Response } from 'express'

const app: Express = express()

app.get('/', (req: Request, res: Response) => {
    res.send('Hello BCA with Express + Typescript Server')
})

export default app