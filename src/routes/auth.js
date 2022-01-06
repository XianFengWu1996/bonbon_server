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
var User_1 = __importDefault(require("../models/User"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var auth_1 = require("../middleware/auth");
var router = (0, express_1.Router)();
router.post('/signup', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var dupEmail, user, token, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, User_1.default.findOne({ email: req.body.email })
                    // Check for duplicated email, and return a error is founded
                ];
            case 1:
                dupEmail = _a.sent();
                // Check for duplicated email, and return a error is founded
                if (dupEmail) {
                    return [2 /*return*/, res.status(400).send({ error: 'Please use a different email, email is taken' })];
                }
                user = new User_1.default({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password, // will be hashed before saved
                });
                return [4 /*yield*/, user.save()];
            case 2:
                _a.sent();
                return [4 /*yield*/, user.generateToken()];
            case 3:
                token = _a.sent();
                // generateToken() will called the save() method
                res.status(201).send({ user: user, token: token });
                return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                res.status(400).send({ error: error_1.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.post('/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, passwordMatch, token, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, User_1.default.findOne({ email: req.body.email })
                    // if user email does not exist
                ];
            case 1:
                user = _a.sent();
                // if user email does not exist
                if (!user) {
                    throw new Error('Unable to login, check email and password');
                }
                return [4 /*yield*/, bcryptjs_1.default.compare(req.body.password, user.password)
                    // if password does not match
                ];
            case 2:
                passwordMatch = _a.sent();
                // if password does not match
                if (!passwordMatch) {
                    throw new Error('Unable to login, check email and password');
                }
                if (user.isDisabled) {
                    throw new Error('Account has been suspended');
                }
                user.last_login = new Date();
                return [4 /*yield*/, user.generateToken()];
            case 3:
                token = _a.sent();
                res.status(200).send({ user: user, token: token });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _a.sent();
                console.log(error_2);
                res.status(400).send({ error: error_2.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.post('/login/save', auth_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, token, error_3;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                return [4 /*yield*/, User_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)];
            case 1:
                user = _c.sent();
                // if user email does not exist
                if (!user) {
                    throw new Error('Unable to login, check email and password');
                }
                if (user.isDisabled) {
                    throw new Error('Account has been suspended');
                }
                user.last_login = new Date();
                token = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.replace('Bearer ', '');
                res.status(200).send({ user: user, token: token });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _c.sent();
                console.log(error_3);
                res.status(400).send({ error: error_3.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/logout', auth_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, index, error_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                return [4 /*yield*/, User_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).send({ error: 'Not found' })];
                }
                index = user.tokens.findIndex(function (tokens) { return tokens.token === req.token; });
                user.tokens.splice(index, 1);
                return [4 /*yield*/, user.save()];
            case 2:
                _b.sent();
                res.status(200).send();
                return [3 /*break*/, 4];
            case 3:
                error_4 = _b.sent();
                res.status(400).send({ error: error_4.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// forgot password - to send the link
// reset password - to verified the link and proceed with the password update
// update email 
// update name and profile pic
// email verify
exports.default = router;
