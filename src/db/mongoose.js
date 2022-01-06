"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
if (!process.env.MONGODB_URL) {
    process.exit(1); // exit with a fail code, if not mongodb url is found
}
mongoose_1.default.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    autoIndex: false
});
