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
const users_controller_1 = require("../controller/users-controller");
const companies_controller_1 = require("./../controller/companies-controller");
const validateToken_1 = require("./../middleware/validateToken");
const express_1 = __importDefault(require("express"));
const supplier_controller_1 = require("../controller/supplier-controller");
const supplier_validator_1 = require("../validators/supplier-validator");
const router = express_1.default.Router();
router.post("/", validateToken_1.validateToken, (0, dataValidation_1.validateData)(supplier_validator_1.createSupplierValidator), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyUUID, userUUID } = res.locals.token;
    // DATA VALIDATION
    const company = yield (0, companies_controller_1.getCompany)(companyUUID);
    if (!company)
        return res.status(404).json({ detail: "Company not found" });
    const user = yield (0, users_controller_1.getOneUser)(userUUID, companyUUID);
    if (!user)
        return res.status(404).json({ detail: `User not found` });
    // END OF DATA VALIDATION
    const createdSupplierResponse = yield (0, supplier_controller_1.createSupplier)(req.body, company, user);
    if (createdSupplierResponse.status !== 201)
        return res.status(createdSupplierResponse.status).json({ detail: createdSupplierResponse.detail });
    return res.status(createdSupplierResponse.status).json({ detail: (0, format_1.formatOneSupplierResponse)(createdSupplierResponse.detail) });
}));
router.get("/", validateToken_1.validateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyUUID } = res.locals.token;
    const suppliers = yield (0, supplier_controller_1.getAllSuppliers)(companyUUID);
    return res.status(200).json({ detail: suppliers });
}));
router.get("/:uuid", validateToken_1.validateToken, validateUuid_1.validateUUID, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyUUID } = res.locals.token;
    const { uuid } = req.params;
    const supplier = yield (0, supplier_controller_1.getOneSupplier)(companyUUID, uuid);
    if (!supplier)
        return res.status(404).json({ detail: `Supplier with uuid: ${uuid} does not exist` });
    return res.status(200).json({ detail: supplier });
}));
router.put("/:uuid", validateToken_1.validateToken, validateUuid_1.validateUUID, (0, dataValidation_1.validateData)(supplier_validator_1.updateSupplierValidator), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyUUID } = res.locals.token;
    const { uuid } = req.params;
    const supplier = yield (0, supplier_controller_1.getOneSupplier)(companyUUID, uuid);
    if (!supplier)
        return res.status(404).json({ detail: `Supplier with uuid: ${uuid} does not exist` });
    const updatedSupplierResponse = yield (0, supplier_controller_1.updateSupplier)(req.body, supplier);
    return res.status(updatedSupplierResponse.status).json({ detail: updatedSupplierResponse.detail });
}));
exports.default = router;
