import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";
import { secretKey } from '../../environment';


export const validateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization

    if (!token) return res.status(401).json('Unauthorized')

    const tokenData = token?.split(' ')

    if (tokenData[0] !== `Bearer`) return res.status(401).json({detail: "Unauthorized"})

    try {
        const jwtPayload = <any>jwt.verify(tokenData[1], secretKey)

        res.locals.token = jwtPayload
    } catch (error) {
        return res.status(401).json({detail: "Unauthorized"})
    }
    
    next()
}