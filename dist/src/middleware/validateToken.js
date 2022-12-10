"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const environment_1 = require("../../environment");
const validateToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token)
        return res.status(401).json('Unauthorized');
    const tokenData = token === null || token === void 0 ? void 0 : token.split(' ');
    if (tokenData[0] !== `Bearer`)
        return res.status(401).json({ detail: "Unauthorized" });
    try {
        const jwtPayload = jsonwebtoken_1.default.verify(tokenData[1], environment_1.secretKey);
        res.locals.token = jwtPayload;
    }
    catch (error) {
        return res.status(401).json({ detail: "Unauthorized" });
    }
    next();
};
exports.validateToken = validateToken;
