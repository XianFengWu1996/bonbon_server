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
exports.UserSchema = exports.Role = void 0;
var mongoose_1 = __importStar(require("mongoose"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var validator_1 = __importDefault(require("validator"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// User Interface
var Role;
(function (Role) {
    Role["admin"] = "admin";
    Role["member"] = "member";
})(Role = exports.Role || (exports.Role = {}));
// Create User Schema
exports.UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate: function (value) {
            if (!validator_1.default.isEmail(value)) {
                throw new Error('Please enter a valid email');
            }
        }
    },
    password: {
        type: String,
        trim: true,
        minlength: 8,
        required: true,
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            }
        }
    ],
    last_login: {
        type: Date,
        required: true,
        default: new Date()
    },
    password_last_changed: {
        type: Date,
        required: true,
        default: new Date()
    },
    email_verified: {
        type: Boolean,
        default: false,
        required: true,
    },
    isDisabled: {
        type: Boolean,
        default: false,
        required: true,
    },
    disabledReason: {
        type: String,
        default: '',
    },
    profile_picture: {
        type: String,
        default: '',
    },
    role: {
        type: String,
        enum: Role,
        default: Role.member,
        required: true
    },
    // login_method: {
    // }
}, {
    timestamps: true
});
exports.UserSchema.virtual('recipes', {
    ref: 'Recipes',
    localField: '_id',
    foreignField: 'owner'
});
exports.UserSchema.virtual('materials', {
    ref: 'Materials',
    localField: '_id',
    foreignField: 'owner'
});
exports.UserSchema.methods.toJSON = function () {
    // Convert the user to an object
    var user = this.toObject();
    // remove property thats for internal use
    delete user.password; // remove the password property off the object
    delete user.tokens; // remove the tokens property off the object
    delete user.last_login; // remove the last_login property
    delete user.password_last_changed; // remove the password_last_change property
    delete user.isDisabled; // remove the isDisable property
    delete user.disabledReason; // remove the disabledReason property
    delete user.role; // remove the role property
    delete user.__v;
    delete user._id;
    return user; // return the new object to the response
};
// generate the json web token
exports.UserSchema.methods.generateToken = function () {
    return __awaiter(this, void 0, void 0, function () {
        var user, token;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = this;
                    // Sign the token
                    if (!process.env.JWT_SECRET) {
                        throw new Error('Invalid JWT');
                    }
                    token = jsonwebtoken_1.default.sign({ _id: user.id }, process.env.JWT_SECRET, { expiresIn: '7 days' });
                    // push the token into the array
                    user.tokens.unshift({ token: token });
                    // save the user
                    return [4 /*yield*/, user.save()];
                case 1:
                    // save the user
                    _a.sent();
                    return [2 /*return*/, token];
            }
        });
    });
};
// before saving
exports.UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function () {
        var user, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    user = this // the user object which going to get save
                    ;
                    if (!user.isModified('password')) return [3 /*break*/, 2];
                    _a = user;
                    return [4 /*yield*/, bcryptjs_1.default.hash(user.password, 8)];
                case 1:
                    _a.password = _b.sent();
                    _b.label = 2;
                case 2:
                    next();
                    return [2 /*return*/];
            }
        });
    });
});
// Create a model 
var User = mongoose_1.default.model('User', exports.UserSchema);
exports.default = User;
