"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceDetailCreateValidator = void 0;
exports.invoiceDetailCreateValidator = {
    budgetItemUUID: {
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
