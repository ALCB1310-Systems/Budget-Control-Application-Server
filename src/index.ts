import express, { Express, Request, Response } from 'express'
import swaggerUI from 'swagger-ui-express'
import swaggerDocument from './swagger/swagger.json'

import routes from './routes'

const app: Express = express()

app.use(express.json())
app.use(routes)
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.get('/', (req: Request, res: Response) => {
    res.send('Hello BCA with Express + Typescript Server')
})

export default app