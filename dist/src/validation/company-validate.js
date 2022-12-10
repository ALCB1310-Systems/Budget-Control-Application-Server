"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCompanyValidator = void 0;
exports.createCompanyValidator = {
    ruc: {
        required: true,
        type: 'string',
        length: 8
    },
    name: {
        required: true,
        type: 'string',
    },
    employees: {
        required: true,
        type: 'number'
    },
    email: {
        required: true,
        type: 'email'
    },
    password: {
        required: true,
        type: 'string',
        length: 8
    },
    fullname: {
        required: true,
        type: 'string'
    }
};
