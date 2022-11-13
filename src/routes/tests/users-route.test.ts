import request from 'supertest';
import app from '../..';

const endpoint = `/users`;

describe('users routes', () => {
	describe('Given it access the POST route', () => {
		it('should return 400 if no json is sent', async () => {
			const result = request(app).post(endpoint);

			expect((await result).statusCode).toBe(400);
		});
	});
});
