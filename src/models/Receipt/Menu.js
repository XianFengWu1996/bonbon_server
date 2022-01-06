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
exports.MenuSchema = exports.MenuItemSchema = exports.ItemOptionsSchema = exports.UnitOptionSchema = void 0;
var mongoose_1 = __importStar(require("mongoose"));
exports.UnitOptionSchema = new mongoose_1.Schema({
    unit: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    }
});
exports.ItemOptionsSchema = new mongoose_1.Schema({
    flavor: {
        type: String,
        required: true
    },
    unitOption: {
        type: [exports.UnitOptionSchema]
    }
});
exports.MenuItemSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        toUpperCase: true,
        trim: true,
        validate: {
            validator: function (v) {
                if (!v || v.length == 0) {
                    return false;
                }
            },
            message: 'Missing Field (name)'
        }
    },
    options: {
        type: [exports.ItemOptionsSchema]
    }
});
exports.MenuSchema = new mongoose_1.Schema({
    menu: {
        type: [exports.MenuItemSchema]
    },
    owner: {
        type: String,
        required: true,
        ref: 'User'
    }
}, {});
exports.MenuSchema.methods.toJSON = function () {
    var menu = this.toObject();
    delete menu.owner;
    delete menu.__v;
    return menu;
};
var Menu = mongoose_1.default.model('Menu', exports.MenuSchema);
exports.default = Menu;
