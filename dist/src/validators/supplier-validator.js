"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSupplierValidator = exports.createSupplierValidator = void 0;
exports.createSupplierValidator = {
    supplier_id: {
        required: true,
        type: 'string',
        length: 10
    },
    name: {
        required: true,
        type: 'string'
    },
    contact_name: {
        required: false,
        type: 'string'
    },
    contact_email: {
        required: false,
        type: 'email'
    },
    contact_phone: {
        required: false,
        type: 'string',
        length: 7
    }
};
exports.updateSupplierValidator = {
    supplier_id: {
        required: false,
        type: 'string',
        length: 10
    },
    name: {
        required: false,
        type: 'string'
    },
    contact_name: {
        required: false,
        type: 'string'
    },
    contact_email: {
        required: false,
        type: 'email'
    },
    contact_phone: {
        required: false,
        type: 'string',
        length: 7
    }
};
