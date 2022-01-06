"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var auth_1 = require("../../middleware/auth");
var Receipt_1 = __importDefault(require("../../models/Receipt/Receipt"));
var router = (0, express_1.Router)();
var validateReceiptData = function (receipt) {
    if (!receipt.customerName) {
        throw new Error('Customer name is required');
    }
    if (!receipt.customerPhone) {
        throw new Error('Customer phone is required');
    }
    if (!receipt.pickupDate) {
        throw new Error('Pick up date is required');
    }
    if (!receipt.receiptName) {
        throw new Error('Receipt name is required');
    }
    if (!receipt.total) {
        throw new Error('Total is required');
    }
    if (!receipt.merchantCartQuantity) {
        throw new Error('Cart quantity is required');
    }
    if (!receipt.merchants) {
        throw new Error('Merchant items are required');
    }
};
router.get('/receipt', auth_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var receipts, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Receipt_1.default.find({ owner: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }).sort({ 'createdAt': -1 })];
            case 1:
                receipts = _b.sent();
                if (!receipts) {
                    return [2 /*return*/, res.status(404).send({ error: 'No receipt found' })];
                }
                res.status(200).send({ receipts: receipts });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                res.status(400).send({ error: error_1.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/receipt', auth_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var receipt, newReceipt, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                receipt = req.body.receipt;
                console.log(receipt);
                validateReceiptData(receipt);
                return [4 /*yield*/, Receipt_1.default.create(__assign(__assign({}, receipt), { owner: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }))];
            case 1:
                newReceipt = _b.sent();
                res.status(200).send({ receipt: newReceipt });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                console.log(error_2);
                res.status(400).send({ error: error_2.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.patch('/receipt/:id', auth_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var receipt, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                validateReceiptData(req.body.receipt);
                return [4 /*yield*/, Receipt_1.default.findOne({ _id: req.params.id, owner: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id })];
            case 1:
                receipt = _b.sent();
                if (!receipt) {
                    res.status(404).send({ error: 'Not found' });
                }
                Object.assign(receipt, req.body.receipt);
                return [4 /*yield*/, (receipt === null || receipt === void 0 ? void 0 : receipt.save())];
            case 2:
                _b.sent();
                res.status(200).send({ receipt: receipt });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _b.sent();
                res.status(400).send({ error: error_3.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.delete('/receipt/:id', auth_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var receipt, error_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Receipt_1.default.findOneAndRemove({
                        owner: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
                        _id: req.params.id
                    })];
            case 1:
                receipt = _b.sent();
                if (!receipt) {
                    return [2 /*return*/, res.status(404).send({ error: 'Not Found' })];
                }
                res.status(200).send({ receipt: receipt });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _b.sent();
                res.status(400).send({ error: error_4.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;