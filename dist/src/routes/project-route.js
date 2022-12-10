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
const project_controller_1 = require("./../controller/project-controller");
const validateToken_1 = require("./../middleware/validateToken");
const express_1 = __importDefault(require("express"));
const companies_controller_1 = require("../controller/companies-controller");
const users_controller_1 = require("../controller/users-controller");
const project_validator_1 = require("../validators/project-validator");
const router = express_1.default.Router();
router.post('/', validateToken_1.validateToken, (0, dataValidation_1.validateData)(project_validator_1.createProjectValidator), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userUUID, companyUUID } = res.locals.token;
    // DATA VALIDATION
    const company = yield (0, companies_controller_1.getCompany)(companyUUID);
    if (!company)
        return res.status(404).json({ detail: "Company not found" });
    const user = yield (0, users_controller_1.getOneUser)(userUUID, companyUUID);
    if (!user)
        return res.status(404).json({ detail: `User not found` });
    // END OF DATA VALIDATION
    const createdProjectResponse = yield (0, project_controller_1.createProject)(req.body, company, user);
    return res.status(createdProjectResponse.status).json({ detail: createdProjectResponse.detail });
}));
router.get("/", validateToken_1.validateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyUUID } = res.locals.token;
    const projects = yield (0, project_controller_1.getAllProjects)(companyUUID);
    return res.status(200).json({ detail: projects });
}));
router.get("/:uuid", validateToken_1.validateToken, validateUuid_1.validateUUID, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyUUID } = res.locals.token;
    const projectUUID = req.params.uuid;
    const project = yield (0, project_controller_1.getOneProject)(projectUUID, companyUUID);
    if (!project)
        return res.status(404).json({ detail: `No project with uuid: ${projectUUID}` });
    return res.status(200).json({ detail: project });
}));
router.put("/:uuid", validateToken_1.validateToken, validateUuid_1.validateUUID, (0, dataValidation_1.validateData)(project_validator_1.updateProjectValidator), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyUUID } = res.locals.token;
    const projectUUID = req.params.uuid;
    const project = yield (0, project_controller_1.getOneProject)(projectUUID, companyUUID);
    if (!project)
        return res.status(404).json({ detail: `No project with uuid: ${projectUUID}` });
    const updateProjectResponse = yield (0, project_controller_1.updateProject)(req.body, project);
    return res.status(updateProjectResponse.status).json({ detail: updateProjectResponse.detail });
}));
exports.default = router;
