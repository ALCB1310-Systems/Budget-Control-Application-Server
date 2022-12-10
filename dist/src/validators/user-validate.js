"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserValidator = exports.createUserValidator = void 0;
exports.createUserValidator = {
    email: {
        required: true,
        type: 'email'
    },
    password: {
        required: true,
        type: 'string',
        length: 8
    },
    name: {
        required: true,
        type: 'string'
    }
};
exports.updateUserValidator = {
    email: {
        required: false,
        type: 'email'
    },
    password: {
        required: false,
        type: 'string',
        length: 8
    },
    name: {
        required: false,
        type: 'string'
    }
};
