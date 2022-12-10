"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateData = void 0;
const validateUuid_1 = require("./validateUuid");
const validateEmail_1 = require("./validateEmail");
const dateValidation_1 = require("../helpers/dateValidation");
const validateData = (dataValidator) => {
    // need to return a function so we can have the request, response and the next function
    return (req, res, next) => {
        // iterate through each object property in the data validator to validate that we are receiving valid information
        // will always return what key triggered the validation error and what happened to trigger the error
        for (const key in dataValidator) {
            if (req.body[key] === '')
                delete req.body[key];
            if (dataValidator[key].required && req.body[key] === undefined) // This will check if a required value is present
                return res.status(400).json({
                    detail: {
                        errorKey: key,
                        errorDescription: `${key} is required`
                    }
                });
            if (dataValidator[key].type === 'email' && req.body[key] !== undefined && req.body[key] !== '' && req.body[key] !== null && !(0, validateEmail_1.isEmailValid)(req.body[key])) { // If it is an email we will use our email validator
                return res.status(400).json({
                    detail: {
                        errorKey: key,
                        errorDescription: `${key} should be a valid email`
                    }
                });
            }
            if (dataValidator[key].type === 'uuid' && req.body[key] !== undefined && req.body[key] !== null && !(0, validateUuid_1.isValidUUID)(req.body[key])) { // If it is an UUID we will use our UUID validator
                return res.status(400).json({
                    detail: {
                        errorKey: key,
                        errorDescription: `${key} should be a valid UUID`
                    }
                });
            }
            if (dataValidator[key].type === 'number' && req.body[key] !== undefined && typeof req.body[key] !== 'number')
                return res.status(400).json({
                    detail: {
                        errorKey: key,
                        errorDescription: `${key} should be a number`
                    }
                });
            if (dataValidator[key].type === 'number' && req.body[key] !== undefined && req.body[key] < 0)
                return res.status(400).json({
                    detail: {
                        errorKey: key,
                        errorDescription: `${key} should be a positive number`
                    }
                });
            if (dataValidator[key].type === 'boolean' && req.body[key] !== undefined && typeof req.body[key] !== 'boolean')
                return res.status(400).json({
                    detail: {
                        errorKey: key,
                        errorDescription: `${key} should be a boolean`
                    }
                });
            if ('length' in dataValidator[key] && req.body[key] !== undefined && req.body[key] !== '' && req.body[key] !== null && req.body[key].length < dataValidator[key].length)
                return res.status(400).json({
                    detail: {
                        errorKey: key,
                        errorDescription: `${key} should have at least ${dataValidator[key].length} characters`
                    }
                });
            if (dataValidator[key].type === 'date' && req.body[key] !== undefined && !(0, dateValidation_1.isValidDate)(req.body[key]))
                return res.status(400).json({
                    detail: {
                        errorKey: key,
                        errorDescription: `${key} should be a valid date`
                    }
                });
        }
        // If there is no error validation then go to the next function
        next();
    };
};
exports.validateData = validateData;
