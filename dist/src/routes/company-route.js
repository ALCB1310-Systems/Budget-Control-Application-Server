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
const company_validator_1 = require("../validators/company-validator");
const validateToken_1 = require("./../middleware/validateToken");
const companies_controller_1 = require("./../controller/companies-controller");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post('/', (0, dataValidation_1.validateData)(company_validator_1.createCompanyValidator), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createCompanyResult = yield (0, companies_controller_1.createCompany)(req.body);
    return res.status(createCompanyResult.status).json({ detail: createCompanyResult.detail });
}));
router.get('/', validateToken_1.validateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyUUID } = res.locals.token;
    const company = yield (0, companies_controller_1.getCompany)(companyUUID);
    return res.status(200).json({ data: company });
}));
router.put("/", validateToken_1.validateToken, (0, dataValidation_1.validateData)(company_validator_1.updateCompanyValidator), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyUUID } = res.locals.token;
    let { ruc, name, employees } = req.body;
    const company = yield (0, companies_controller_1.getCompany)(companyUUID);
    if (!company)
        return res.status(404).json({ detail: `No company found` });
    if (!ruc)
        ruc = company === null || company === void 0 ? void 0 : company.ruc;
    if (!name)
        name = company === null || company === void 0 ? void 0 : company.name;
    if (!employees)
        employees = company.employees;
    const updateCompanyResult = yield (0, companies_controller_1.updateCompany)({ ruc, name, employees }, company);
    return res.status(updateCompanyResult.status).json({ detail: updateCompanyResult.detail });
}));
exports.default = router;
