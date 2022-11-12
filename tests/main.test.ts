import request from 'supertest'
import app from "../src"

describe('My first TS test', () => { 
    it('should assert that true is true', () => {
        expect(true).toBe(true)
    })
 })

 describe('Given I am querying the home route', () => {
    it('should return 200 status code',async () => {
        const result = await request(app).get("/")

        expect(result.statusCode).toBe(200)
    })
 })