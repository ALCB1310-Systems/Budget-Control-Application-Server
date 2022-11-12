import request from 'supertest'
import app from "../src"


 describe('Given I am querying the home route', () => {
    it('should return 200 status code',async () => {
        const result = await request(app).get("/")

        expect(result.statusCode).toBe(200)
    })
 })