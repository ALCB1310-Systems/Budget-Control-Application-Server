"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProjectValidator = exports.createProjectValidator = void 0;
exports.createProjectValidator = {
    name: {
        required: true,
        type: 'string'
    },
    is_active: {
        required: true,
        type: 'boolean'
    }
};
exports.updateProjectValidator = {
    name: {
        required: false,
        type: 'string'
    },
    is_active: {
        required: false,
        type: 'boolean'
    }
};
