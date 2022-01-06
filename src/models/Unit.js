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
exports.unitSchema = void 0;
var mongoose_1 = __importStar(require("mongoose"));
exports.unitSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        lowercase: true,
    },
    chinese: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        lowercase: true,
    },
    shortHand: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        lowercase: true,
    },
    conversion: {
        type: Number,
        required: true,
        minlength: 1,
    },
    needsConversion: {
        type: Boolean,
        required: true,
        default: true,
    },
});
exports.unitSchema.virtual('material', {
    localField: '_id',
    ref: 'Materials',
    foreignField: 'unit'
});
var Units = mongoose_1.default.model('Units', exports.unitSchema);
exports.default = Units;
