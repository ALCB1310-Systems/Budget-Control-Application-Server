"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generateToken_1 = require("./../auth/generateToken");
const passwordHashing_1 = require("./../middleware/passwordHashing");
const validatePassword_1 = require("./../middleware/validatePassword");
const validateEmail_1 = require("./../middleware/validateEmail");
const express_1 = __importDefault(require("express"));
const users_entity_1 = require("../models/users-entity");
const data_source_1 = require("../db/data-source");
const router = express_1.default.Router();
const userRepository = data_source_1.AppDataSource.getRepository(users_entity_1.User);
router.post("/", validateEmail_1.validateEmail, validatePassword_1.validatePassword, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield userRepository.findOne({
        where: { email: email },
        relations: ["company"]
    });
    if (!user)
        return res.status(401).json({ detail: `Invalid credentials` });
    const isCorrectPassword = yield (0, passwordHashing_1.verifyPassword)(password, user.password);
    if (!isCorrectPassword)
        return res.status(401).json({ detail: `Invalid credentials` });
    const token = (0, generateToken_1.jwtGenerator)(user.uuid, user.company.uuid);
    const tokenResponse = {
        token,
        type: `Bearer`
    };
    return res.status(200).json(tokenResponse);
}));
exports.default = router;
