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
exports.MaterialSchema = void 0;
var mongoose_1 = __importStar(require("mongoose"));
exports.MaterialSchema = new mongoose_1.Schema({
    unit: {
        type: String,
        required: true,
        ref: 'Units'
    },
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        minlength: 1
    },
    totalUnitAmount: {
        type: Number,
        required: true,
        minlength: 0,
    },
    price: {
        type: Number,
        required: true,
        minlength: 0,
    },
    unitPrice: {
        type: Number,
        required: true,
        minlength: 0,
    },
    owner: {
        type: String,
        required: true,
        ref: 'User'
    },
});
exports.MaterialSchema.virtual('recipes', {
    ref: 'Recipes',
    localField: '_id',
    foreignField: 'materials'
});
var Materials = mongoose_1.default.model('Materials', exports.MaterialSchema);
exports.default = Materials;
