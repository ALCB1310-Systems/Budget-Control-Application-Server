import { NextFunction, Request, Response } from "express";
import { isEmailValid } from "./validateEmail";

export const validateData = (dataValidator: any) => {

    // need to return a function so we can have the request, response and the next function

    return (req: Request, res: Response, next: NextFunction) => {
        // iterate through each object property in the data validator to validate that we are receiving valid information
        // will always return what key triggered the validation error and what happened to trigger the error
        for (const key in dataValidator){
            if (dataValidator[key].required && !req.body[key]) // This will check if a required value is present
                return res.status(400).json({
                    detail: {
                        errorKey: key,
                        errorDescription: `${key} is required`
                    }
                })
            
            if (dataValidator[key].type === 'email' && req.body[key] !== undefined && !isEmailValid(req.body[key])) // If it is an email we will use our email validator
                return res.status(400).json({
                    detail: {
                        errorKey: key,
                        errorDescription: `${key} should be a valid email`
                    }
                })

            if (dataValidator[key].type === 'number' && req.body[key] !== undefined  && typeof req.body[key] !== 'number') 
                return res.status(400).json({
                    detail: {
                        errorKey: key,
                        errorDescription: `${key} should be a number`
                    }
                })

            if (dataValidator[key].type === 'number' && req.body[key] !== undefined  && req.body[key] <  0)
                return res.status(400).json({
                    detail: {
                        errorKey: key,
                        errorDescription: `${key} should be a positive number`
                    }
                })
            
            if (dataValidator[key].type === 'boolean' && req.body[key] !== undefined && typeof req.body[key] !== 'boolean')
                return res.status(400).json({
                    detail: {
                        errorKey: key,
                        errorDescription: `${key} should be a boolean`
                    }
                })
            
            if ('length' in dataValidator[key] && req.body[key] !== undefined  && req.body[key].length < dataValidator[key].length)
                    return res.status(400).json({
                        detail: {
                            errorKey: key,
                            errorDescription: `${key} should have at least ${dataValidator[key].length} characters`
                        }
                    })
            
        }

        // If there is no error validation then go to the next function
        next()
    }
}