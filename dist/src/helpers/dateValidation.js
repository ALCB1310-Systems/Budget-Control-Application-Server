"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidDate = void 0;
const moment_1 = __importDefault(require("moment"));
const isValidDate = (dateString) => {
    if (!(0, moment_1.default)(dateString, 'YYYY-MM-DD', true).isValid())
        return false;
    return true;
};
exports.isValidDate = isValidDate;
