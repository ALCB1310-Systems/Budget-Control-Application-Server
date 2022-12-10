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
const dataValidation_1 = require("./../middleware/dataValidation");
const validateUuid_1 = require("./../middleware/validateUuid");
const format_1 = require("./../helpers/format");
const users_controller_1 = require("./../controller/users-controller");
const validateToken_1 = require("./../middleware/validateToken");
const express_1 = __importDefault(require("express"));
const companies_controller_1 = require("../controller/companies-controller");
const user_validator_1 = require("../validators/user-validator");
const router = express_1.default.Router();
router.post('/', validateToken_1.validateToken, (0, dataValidation_1.validateData)(user_validator_1.createUserValidator), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyUUID } = res.locals.token;
    const { email, password, name } = req.body;
    // DATA VALIDATION
    const company = yield (0, companies_controller_1.getCompany)(companyUUID);
    if (!company)
        return res.status(404).json({ detail: "Company not found" });
    //  END OF DATA VALIDATION
    // MUST ONLY BE ALLOWED TO CREATE AS MANY USERS AS THE COMPANY HAS EMPLOYEES
    const totalUsers = yield (0, users_controller_1.getTotalUsers)(company);
    if (totalUsers >= company.employees)
        return res.status(403).json({ detail: "Unauthorized: Maximum amount of registered users reached" });
    // END OF AUTHORIZATION
    const createUserResponse = yield (0, users_controller_1.createUser)({ email, password, name, company });
    if (createUserResponse.status === 409)
        return res.status(createUserResponse.status).json({ detail: createUserResponse.detail });
    return res.status(createUserResponse.status).json({ detail: (0, format_1.formatOneUserResponse)(createUserResponse.detail, company) });
}));
router.get("/", validateToken_1.validateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyUUID } = res.locals.token;
    // DATA VALIDATION
    const company = yield (0, companies_controller_1.getCompany)(companyUUID);
    if (!company)
        return res.status(404).json({ detail: "Company not found" });
    //  END OF DATA VALIDATION
    const users = yield (0, users_controller_1.getAllUsers)(companyUUID);
    res.status(200).json({ detail: (0, format_1.formatManyUserResponse)(users, company) });
}));
router.get("/:uuid", validateToken_1.validateToken, validateUuid_1.validateUUID, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyUUID, userUUID } = res.locals.token;
    const uuid = req.params.uuid;
    const uuidToLook = uuid.toLowerCase() === 'me' ? userUUID : uuid;
    // DATA VALIDATION
    const company = yield (0, companies_controller_1.getCompany)(companyUUID);
    if (!company)
        return res.status(404).json({ detail: "Company not found" });
    //  END OF DATA VALIDATION
    const user = yield (0, users_controller_1.getOneUser)(uuidToLook, companyUUID);
    if (!user)
        return res.status(404).json({ detail: `No user found` });
    return res.status(200).json({ detail: (0, format_1.formatOneUserResponse)(user, company) });
}));
router.put("/:uuid", validateToken_1.validateToken, validateUuid_1.validateUUID, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyUUID, userUUID } = res.locals.token;
    const uuid = req.params.uuid;
    const uuidToLook = uuid.toLowerCase() === 'me' ? userUUID : uuid;
    // DATA VALIDATION
    const company = yield (0, companies_controller_1.getCompany)(companyUUID);
    if (!company)
        return res.status(404).json({ detail: "Company not found" });
    //  END OF DATA VALIDATION
    const user = yield (0, users_controller_1.getOneUser)(uuidToLook, companyUUID);
    if (!user)
        return res.status(404).json({ detail: `No user found` });
    const updateUserResponse = yield (0, users_controller_1.updateUser)(req.body, user);
    return res.status(updateUserResponse.status).json({ detail: (0, format_1.formatOneUserResponse)(updateUserResponse.detail, company) });
}));
exports.default = router;
