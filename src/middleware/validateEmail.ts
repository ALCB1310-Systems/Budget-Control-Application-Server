import { NextFunction, Request, Response } from "express";

export const validateEmail = (req: Request, res: Response, next: NextFunction) => {
	const { email } = req.body;

	if (!email) 
		return res
			.status(401)
			.json({detail: `Invalid credentials`});

	if (email ? !isEmailValid(email) : null) 
		return res
			.status(401)
			.json({detail: `Invalid credentials`});
	

	next();
};

export const isEmailValid = (email: string) => {
	const mailformat =
		/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

	return mailformat.test(email);
};