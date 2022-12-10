"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtGenerator = void 0;
const environment_1 = require("./../../environment");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtGenerator = (userUUID, companyUUID) => {
    const payload = {
        userUUID,
        companyUUID
    };
    return jsonwebtoken_1.default.sign(payload, environment_1.secretKey, {
        algorithm: "HS256",
        expiresIn: 3600,
    });
};
exports.jwtGenerator = jwtGenerator;
