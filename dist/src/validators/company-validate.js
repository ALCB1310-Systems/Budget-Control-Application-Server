"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCompanyValidator = exports.createCompanyValidator = void 0;
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
exports.updateCompanyValidator = {
    ruc: {
        required: false,
        type: 'string',
        length: 8
    },
    name: {
        required: false,
        type: 'string',
    },
    employees: {
        required: false,
        type: 'number'
    }
};
