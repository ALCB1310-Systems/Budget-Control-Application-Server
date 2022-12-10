"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.secretKey = exports.databaseName = exports.databasePassword = exports.databasePort = exports.databaseUsername = exports.databaseHost = exports.port = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.port = process.env.PORT || 5050;
exports.databaseHost = process.env.DATABASE_HOST;
exports.databaseUsername = process.env.DATABASE_USERNAME;
exports.databasePort = parseInt(process.env.DATABASE_PORT);
exports.databasePassword = process.env.DATABASE_PASSWORD;
exports.databaseName = process.env.DATABASE_NAME;
exports.secretKey = process.env.SECRET_KEY;
