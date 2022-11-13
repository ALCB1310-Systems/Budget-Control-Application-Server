import { NextFunction, Request, Response } from "express";

export const validatePassword = (req: Request, res: Response, next: NextFunction) => {
    const { password } = req.body

    if (!isPasswordValid(password)) return res.status(401).json({detail: "Invalid credentials"})

    next()
}

export const isPasswordValid = (password: string | undefined | null) => {
    if (!password) return false

    return true
}