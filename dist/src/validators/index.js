"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDataValid = void 0;
const validateEmail_1 = require("../middleware/validateEmail");
const isDataValid = (toValidate, requiredData) => {
    for (const key in requiredData) {
        if (requiredData[key].required && !toValidate[key])
            return { status: false, errorKey: key, errorDescription: `${key} is required` };
        if (requiredData[key].type === 'email' && !(0, validateEmail_1.isEmailValid)(toValidate[key]))
            return { status: false, errorKey: key, errorDescription: `${key} should be a valid email` };
        if (requiredData[key].type === 'number' && typeof toValidate[key] !== 'number') {
            return { status: false, errorKey: key, errorDescription: `${key} should be a number` };
        }
        if (requiredData[key].type === 'number' && toValidate[key] <= 0) {
            return { status: false, errorKey: key, errorDescription: `${key} should be a positive number` };
        }
        if ('length' in requiredData[key] && toValidate[key].length < requiredData[key].length)
            return { status: false, errorKey: key, errorDescription: `${key} should have at least ${requiredData[key].length} characters` };
    }
    return { status: true, errorKey: null, errorDescription: null };
};
exports.isDataValid = isDataValid;
