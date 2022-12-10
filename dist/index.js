"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = __importDefault(require("./src"));
const environment_1 = require("./environment");
src_1.default.listen(environment_1.port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${environment_1.port}`);
});
