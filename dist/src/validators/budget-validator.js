"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBudgetValidator = exports.budgetCreateValidator = void 0;
exports.budgetCreateValidator = {
    project_id: {
        required: true,
        type: 'uuid'
    },
    budget_item_id: {
        required: true,
        type: 'uuid'
    },
    quantity: {
        required: true,
        type: 'number'
    },
    cost: {
        required: true,
        type: 'number'
    }
};
exports.updateBudgetValidator = {
    project_id: {
        required: false,
        type: 'uuid'
    },
    budget_item_id: {
        required: false,
        type: 'uuid'
    },
    quantity: {
        required: false,
        type: 'number'
    },
    cost: {
        required: false,
        type: 'number'
    }
};
