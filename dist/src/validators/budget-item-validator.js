"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBudgetItemValidator = exports.createBudgetItemValidator = void 0;
exports.createBudgetItemValidator = {
    code: {
        required: true,
        type: 'string'
    },
    name: {
        required: true,
        type: 'string'
    },
    accumulates: {
        required: true,
        type: 'boolean'
    },
    level: {
        required: true,
        type: 'number'
    },
    parentUuid: {
        required: false,
        type: 'uuid'
    }
};
exports.updateBudgetItemValidator = {
    code: {
        required: true,
        type: 'string'
    },
    name: {
        required: true,
        type: 'string'
    },
    accumulates: {
        required: true,
        type: 'boolean'
    },
    level: {
        required: true,
        type: 'number'
    },
    parentUuid: {
        required: false,
        type: 'uuid'
    }
};
