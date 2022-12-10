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
const supertest_1 = __importDefault(require("supertest"));
const __1 = __importDefault(require("../.."));
const endpoint = `/companies`;
describe(`users routes`, () => {
    describe(`Given it access the POST route`, () => {
        it(`should return 400 if no json is sent`, () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield (0, supertest_1.default)(__1.default).post(endpoint);
            expect(result.statusCode).toBe(400);
        }));
        it(`should return 400 if no ruc was sent`, () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield (0, supertest_1.default)(__1.default)
                .post(endpoint)
                .send({ name: 'Test Company', employees: 10 });
            expect(result.status).toBe(400);
        }));
        it(`should return 400 if no name is sent`, () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield (0, supertest_1.default)(__1.default)
                .post(endpoint)
                .send({ ruc: '1234567890', employees: 10 });
            expect(result.status).toBe(400);
        }));
        it(`should return 400 if no employees is sent`, () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield (0, supertest_1.default)(__1.default)
                .post(endpoint)
                .send({ ruc: '1234567890', name: 'Test Company' });
            expect(result.status).toBe(400);
        }));
    });
    describe.skip(`Given it sends a correct json`, () => {
        it(`should return 201`, () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield (0, supertest_1.default)(__1.default)
                .post(endpoint)
                .send({
                ruc: '1234567890',
                name: 'Test Company',
                employees: 10,
            });
            expect(result.status).toBe(201);
        }));
    });
});
