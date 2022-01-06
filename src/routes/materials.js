"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_1 = require("../middleware/auth");
var Material_1 = __importStar(require("../models/Material"));
var Unit_1 = __importDefault(require("../models/Unit"));
var router = (0, express_1.Router)();
// Get all materials 
router.get('/materials', auth_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var materials, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Material_1.default.find({ owner: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id }).populate('unit').exec()];
            case 1:
                materials = _b.sent();
                res.send({ materials: materials });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                console.log(error_1);
                res.status(400).send({ error: error_1.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get materials by id
router.get('/materials/:id', auth_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var material, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Material_1.default.findOne({ _id: req.params.id, owner: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id })];
            case 1:
                material = _b.sent();
                if (!material) {
                    return [2 /*return*/, res.status(404).send({ error: "Not found" })];
                }
                res.send({ material: material });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                res.status(400).send({ error: error_2.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Create a material
router.post('/materials', auth_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var unit, material, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                return [4 /*yield*/, Unit_1.default.findById(req.body.unit)];
            case 1:
                unit = _b.sent();
                if (!unit) {
                    return [2 /*return*/, res.status(404).send({ error: 'Require a unit' })];
                }
                material = new Material_1.default({
                    unit: req.body.unit,
                    name: req.body.name,
                    totalUnitAmount: req.body.totalUnitAmount,
                    price: req.body.price,
                    unitPrice: req.body.unitPrice,
                    owner: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id
                });
                return [4 /*yield*/, material.save()];
            case 2:
                _b.sent();
                res.status(201).send({ material: material });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _b.sent();
                res.status(400).send({ error: error_3.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.patch('/materials/:id', auth_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var allowedField_1, requestField, isValid, material, error_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                allowedField_1 = Object.keys(Material_1.MaterialSchema.paths);
                allowedField_1 = allowedField_1.filter(function (field) {
                    return field !== '_id' && field !== '__v' && field !== 'owner';
                });
                requestField = Object.keys(req.body);
                isValid = requestField.every(function (field) { return allowedField_1.includes(field); });
                if (!isValid) {
                    return [2 /*return*/, res.status(400).send({ error: 'Invalid fields' })];
                }
                return [4 /*yield*/, Material_1.default.findOneAndUpdate({ _id: req.params.id, owner: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id }, { $set: req.body }, { new: true })];
            case 1:
                material = _b.sent();
                if (!material) {
                    return [2 /*return*/, res.status(404).send({ error: 'Not found' })];
                }
                res.send({ material: material });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _b.sent();
                res.status(400).send({ error: error_4.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.delete('/materials/:id', auth_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var material, error_5;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Material_1.default.findOneAndDelete({ _id: req.params.id, owner: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id })];
            case 1:
                material = _b.sent();
                if (!material) {
                    return [2 /*return*/, res.status(404).send({ error: 'Not found' })];
                }
                res.send({ material: material });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _b.sent();
                res.status(400).send({ error: error_5.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
