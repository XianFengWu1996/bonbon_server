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
var Recipe_1 = __importDefault(require("../models/Recipe"));
var router = (0, express_1.Router)();
// GET ALL THE RecipeS 
router.get('/recipe', auth_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var recipe, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Recipe_1.default.find({ owner: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }).populate({
                        path: 'owner',
                        select: 'name email'
                    }).exec()
                    // const recipe = await Recipe.find({owner: req.user?._id})
                ];
            case 1:
                recipe = _b.sent();
                // const recipe = await Recipe.find({owner: req.user?._id})
                if (!recipe) {
                    return [2 /*return*/, res.status(404).send()];
                }
                res.send(recipe);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                res.status(400).send({ error: error_1.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET A Recipe BY ID
router.get('/recipe/:id', auth_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var recipe, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Recipe_1.default.findOne({ _id: req.params.id, owner: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id })
                        .populate({ path: 'owner', select: 'name email' })
                        .populate({ path: 'items.materials', select: 'id name totalUnitAmount price unitPrice' })
                        .exec()];
            case 1:
                recipe = _b.sent();
                if (!recipe) {
                    return [2 /*return*/, res.status(404).send()];
                }
                res.send({ recipe: recipe });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                res.status(400).send({ error: error_2.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// CREATE A NEW Recipe 
router.post('/recipe', auth_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var recipe, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                recipe = new Recipe_1.default({
                    name: req.body.name,
                    description: req.body.description,
                    items: req.body.items,
                    total: req.body.total,
                    owner: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id
                });
                return [4 /*yield*/, recipe.save()];
            case 1:
                _b.sent();
                res.status(201).send({ recipe: recipe });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                res.status(400).send({ error: error_3.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// UPDATING THE Recipe BY ID
router.patch('/recipe/:id', auth_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var allowedField, requestFields, isValid, recipe, error_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                allowedField = ['name', 'description', 'items', 'total'];
                requestFields = Object.keys(req.body);
                isValid = requestFields.every(function (field) { return allowedField.includes(field); });
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                if (!isValid) {
                    return [2 /*return*/, res.status(400).send({ error: 'Invalid fields' })];
                }
                return [4 /*yield*/, Recipe_1.default.findOneAndUpdate({
                        _id: req.params.id,
                        owner: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id
                    }, {
                        $set: req.body
                    }, {
                        new: true
                    })];
            case 2:
                recipe = _b.sent();
                if (!recipe) {
                    return [2 /*return*/, res.status(404).send()];
                }
                res.send({ recipe: recipe });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _b.sent();
                res.status(400).send({ error: error_4.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// DELETE THE Recipe BY ID
router.delete('/recipe/:id', auth_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var recipe, error_5;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Recipe_1.default.findOneAndDelete({ _id: req.params.id, owner: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id })];
            case 1:
                recipe = _b.sent();
                if (!recipe) {
                    return [2 /*return*/, res.status(404).send()];
                }
                res.send({ recipe: recipe });
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
