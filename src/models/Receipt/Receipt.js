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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiptSchema = exports.MerchantItemSchema = void 0;
var mongoose_1 = __importStar(require("mongoose"));
exports.MerchantItemSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    unit: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
    },
    unitPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0,
    },
});
exports.ReceiptSchema = new mongoose_1.Schema({
    receiptName: {
        type: String,
        required: true,
    },
    customerName: {
        type: String,
        required: true,
    },
    customerPhone: {
        type: String,
        required: true,
    },
    pickupDate: {
        type: String,
        required: true,
    },
    total: {
        type: Number,
        required: true,
        min: 0,
    },
    merchantCartQuantity: {
        type: Number,
        required: true,
        min: 0,
    },
    merchants: {
        type: [exports.MerchantItemSchema],
        required: true,
    },
    owner: {
        type: String,
        required: true,
    }
}, { timestamps: true });
exports.ReceiptSchema.methods.toJSON = function () {
    var receipt = this.toObject();
    delete receipt.owner;
    return receipt;
};
var Receipt = mongoose_1.default.model('Receipt', exports.ReceiptSchema);
exports.default = Receipt;
