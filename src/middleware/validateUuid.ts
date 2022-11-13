import { NextFunction, Request, Response } from "express";

export const validateUUID = (req: Request, res: Response, next: NextFunction) => {
	const uuid: string = req.params.uuid;

	if (!isValidUUID(uuid))
		return res.status(400).json({ detail: 'Invalid UUID' });

	next();
};

const isValidUUID = (uuid: string) => {
	const regexExp =
		/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

	return regexExp.test(uuid);
};