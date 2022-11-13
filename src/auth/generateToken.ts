import { secretKey } from './../../environment';
import jwt from 'jsonwebtoken'

export const jwtGenerator = (userUUID: string, companyUUID: string) => {
	const payload = {
		userUUID, 
        companyUUID
	};

	return jwt.sign(payload, secretKey, {
		algorithm: "HS256",
		expiresIn: 3600,
	});
};