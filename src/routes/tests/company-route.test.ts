import request, { Response } from 'supertest'
import app from '../..'

const endpoint = `/companies`

describe(`users routes`, () => { 
    describe(`Given it access the POST route`, () => {
        it(`should return 400 if no json is sent`, async () => {
            const result: Response = await request(app).post(endpoint)

            expect(result.statusCode).toBe(400)
        })

        it(`should return 400 if no ruc was sent`, async () => {
            const result: Response = await request(app).post(endpoint).send({name: "Test Company", employees: 10})

            expect(result.status).toBe(400)
        })

        it(`should return 400 if no name is sent`, async () => {
            const result: Response = await request(app).post(endpoint).send({ruc: "1234567890", employees: 10})

            expect(result.status).toBe(400)
        })

        it(`should return 400 if no employees is sent`, async () => {
            const result: Response = await request(app).post(endpoint).send({ruc: "1234567890", name: "Test Company"})

            expect(result.status).toBe(400)
        })
    })
 })