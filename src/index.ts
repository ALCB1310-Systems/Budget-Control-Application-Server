import express, { Express, Request, Response } from 'express'
import routes from './routes'

const app: Express = express()

app.use(express.json())
app.use(routes)

app.get('/', (req: Request, res: Response) => {
    res.send('Hello BCA with Express + Typescript Server')
})

export default app