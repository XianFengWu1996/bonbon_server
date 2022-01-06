"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config({ path: ".env." + process.env.NODE_ENV });
require('./db/mongoose');
var express_1 = __importDefault(require("express"));
var helmet_1 = __importDefault(require("helmet"));
var auth_1 = __importDefault(require("./routes/auth"));
var recipes_1 = __importDefault(require("./routes/recipes"));
var materials_1 = __importDefault(require("./routes/materials"));
var units_1 = __importDefault(require("./routes/units"));
var menu_1 = __importDefault(require("./routes/Receipt/menu"));
var receipt_1 = __importDefault(require("./routes/Receipt/receipt"));
var app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(auth_1.default); // routes relate to authentication
app.use(recipes_1.default); // routes relate to recipe 
app.use(materials_1.default); // routes relate to material
app.use(units_1.default); // routes relate to unit
app.use(menu_1.default); // routes relate to menu
app.use(receipt_1.default);
exports.default = app;
