"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInvoiceValidator = exports.createInvoiceValidator = void 0;
exports.createInvoiceValidator = {
    project: {
        required: true,
        type: 'uuid'
    },
    supplier: {
        required: true,
        type: 'uuid'
    },
    invoice_number: {
        required: true,
        type: 'string'
    },
    date: {
        required: true,
        type: 'date'
    }
};
exports.updateInvoiceValidator = {
    project: {
        required: false,
        type: 'uuid'
    },
    supplier: {
        required: false,
        type: 'uuid'
    },
    invoice_number: {
        required: false,
        type: 'string'
    },
    date: {
        required: false,
        type: 'date'
    }
};
