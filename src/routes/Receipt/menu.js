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
var auth_1 = require("../../middleware/auth");
var Menu_1 = __importDefault(require("../../models/Receipt/Menu"));
var router = (0, express_1.Router)();
// check unit options
var checkForFlavor = function (flavor, optionList) {
    if (!flavor || flavor.length === 0) {
        throw new Error('Flavor can not be empty');
    }
    // dont want any duplciate flavor
    optionList.forEach(function (option) {
        if (option.flavor === flavor) {
            throw new Error('Duplicate Flavor');
        }
    });
};
var checkForUnitOption = function (unitOption, unitOptionList) {
    // check for string and non null for unit 
    if (!unitOption.unit || unitOption.unit.length === 0) {
        throw new Error('Unit can not be empty');
    }
    if (typeof unitOption.unit !== 'string') {
        throw new Error('Unit must be a string');
    }
    // check for positive and non null number for price
    if (!unitOption.price || unitOption.price < 0) {
        throw new Error('Price must be a positive and not empty');
    }
};
function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
}
router.get('/menu', auth_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var menus, error_1;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                return [4 /*yield*/, Menu_1.default.findOne({
                        owner: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id
                    })];
            case 1:
                menus = _c.sent();
                if (!menus) {
                    menus = new Menu_1.default({
                        menu: [],
                        owner: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id
                    });
                }
                return [4 /*yield*/, menus.save()];
            case 2:
                _c.sent();
                res.status(200).send({ menu: menus.menu });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _c.sent();
                res.status(400).send({ error: error_1.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/menu', auth_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, options, result, flavorList_1, unitList_1, error_2;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                _a = req.body, name_1 = _a.name, options = _a.options;
                // make sure the user data (name) is not null or empty
                if (!name_1 || name_1.length === 0) {
                    return [2 /*return*/, res.status(400).send({ error: 'Missing field (Name)' })];
                }
                return [4 /*yield*/, Menu_1.default.findOne({ owner: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id })];
            case 1:
                result = _c.sent();
                if (!result) {
                    return [2 /*return*/, res.status(404).send({ error: 'Not Found' })];
                }
                // check if the name is duplicate
                result.menu.find(function (item) {
                    if (item.name === name_1) {
                        throw new Error('Duplicate name is not allowed');
                    }
                });
                flavorList_1 = [];
                unitList_1 = [];
                options.forEach(function (option) {
                    flavorList_1.push(option.flavor);
                    option.unitOption.forEach(function (unit) {
                        checkForUnitOption(unit, option.unitOption);
                        unitList_1.push(unit.unit);
                        delete unit._id;
                    });
                });
                if (hasDuplicates(flavorList_1)) {
                    throw new Error('Duplicate Flavor is not allow');
                }
                if (hasDuplicates(unitList_1)) {
                    throw new Error('Duplicate Unit is not allow');
                }
                result.menu.unshift({
                    name: name_1,
                    options: options
                });
                return [4 /*yield*/, result.save()];
            case 2:
                _c.sent();
                res.status(201).send({ option: result.menu[0] });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _c.sent();
                console.log(error_2);
                res.status(400).send({ error: error_2.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// update name of menu item 
router.delete('/menu/:menuItemId', auth_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                return [4 /*yield*/, Menu_1.default.findOne({ owner: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id })];
            case 1:
                result = _b.sent();
                if (!result) {
                    return [2 /*return*/, res.status(404).send({ error: 'Not Found' })];
                }
                result.menu = result.menu.filter(function (item) {
                    var _a;
                    return ((_a = item._id) === null || _a === void 0 ? void 0 : _a.toString()) !== req.params.menuItemId;
                });
                return [4 /*yield*/, result.save()];
            case 2:
                _b.sent();
                res.status(200).send();
                return [3 /*break*/, 4];
            case 3:
                error_3 = _b.sent();
                res.status(400).send({ error: error_3.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// update name of menu item 
router.patch('/menu/:menuItemId/name', auth_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, option, data_1, error_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                return [4 /*yield*/, Menu_1.default.findOne({ owner: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id })];
            case 1:
                result = _b.sent();
                if (!result) {
                    return [2 /*return*/, res.status(404).send({ error: 'Not Found' })];
                }
                option = result.menu.find(function (item) {
                    var _a;
                    return ((_a = item._id) === null || _a === void 0 ? void 0 : _a.toString()) === req.params.menuItemId;
                });
                if (!option) {
                    return [2 /*return*/, res.status(404).send({ error: 'Menu Item Not Found' })];
                }
                data_1 = req.query.data;
                if (data_1.length === 0) {
                    throw new Error('Name can not be empty');
                }
                result.menu.find(function (item) {
                    if (item.name === data_1) {
                        throw new Error('Name duplicate not allowed');
                    }
                });
                option.name = req.query.data;
                return [4 /*yield*/, result.save()];
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
// handling adding a new option
router.post('/menu/:menuItemId/option', auth_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, flavor, unitOptionList, result, menuItem, tempUnitNameList_1, tempUnitList_1, error_5;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                _a = req.body, flavor = _a.flavor, unitOptionList = _a.unitOptionList;
                return [4 /*yield*/, Menu_1.default.findOne({ owner: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id })];
            case 1:
                result = _c.sent();
                if (!result) {
                    return [2 /*return*/, res.status(404).send({ error: 'Not Found' })];
                }
                menuItem = result.menu.find(function (item) {
                    var _a;
                    return ((_a = item._id) === null || _a === void 0 ? void 0 : _a.toString()) === req.params.menuItemId;
                });
                if (!menuItem) {
                    return [2 /*return*/, res.status(404).send({ error: 'Menu Item Not Found' })];
                }
                // double check for valid flavor value
                checkForFlavor(flavor, menuItem.options);
                tempUnitNameList_1 = [];
                tempUnitList_1 = [];
                unitOptionList.forEach(function (el) {
                    tempUnitNameList_1.push(el.unit);
                    tempUnitList_1.push({
                        unit: el.unit,
                        price: el.price,
                    });
                });
                if (hasDuplicates(tempUnitNameList_1)) {
                    return [2 /*return*/, res.status(400).send({ error: 'Duplicated Unit not allowed' })];
                }
                // push the new options in to the array
                menuItem.options.unshift({
                    flavor: flavor,
                    unitOption: tempUnitList_1,
                });
                return [4 /*yield*/, result.save()];
            case 2:
                _c.sent();
                // send back the first in the array since it was unshift into the array
                res.status(200).send({ option: menuItem.options[0] });
                return [3 /*break*/, 4];
            case 3:
                error_5 = _c.sent();
                res.status(400).send({ error: error_5.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// handle deleting an option
router.delete('/menu/:menuItemId/option/:optionId', auth_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, menuItem, error_6;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                return [4 /*yield*/, Menu_1.default.findOne({ owner: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id })];
            case 1:
                result = _b.sent();
                if (!result) {
                    return [2 /*return*/, res.status(404).send({ error: 'Not Found' })];
                }
                menuItem = result.menu.find(function (element) {
                    var _a;
                    return ((_a = element._id) === null || _a === void 0 ? void 0 : _a.toString()) === req.params.menuItemId;
                });
                if (!menuItem) {
                    return [2 /*return*/, res.status(404).send({ error: 'Menu Item Not Found' })];
                }
                menuItem.options = menuItem.options.filter(function (option) {
                    var _a;
                    return ((_a = option._id) === null || _a === void 0 ? void 0 : _a.toString()) !== req.params.optionId;
                });
                console.log(menuItem.options);
                return [4 /*yield*/, result.save()];
            case 2:
                _b.sent();
                res.status(200).send();
                return [3 /*break*/, 4];
            case 3:
                error_6 = _b.sent();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// update a specific option
// handling add, remove, and update unit options
router.patch('/menu/:menuItemId/option/:optionId', auth_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, flavor, removeOption, addOption, updateOption, result, menuItem, option_1, error_7;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                _a = req.body, flavor = _a.flavor, removeOption = _a.removeOption, addOption = _a.addOption, updateOption = _a.updateOption;
                return [4 /*yield*/, Menu_1.default.findOne({ owner: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id })];
            case 1:
                result = _c.sent();
                if (!result) {
                    return [2 /*return*/, res.status(404).send({ error: 'Menu Not Found' })];
                }
                menuItem = result.menu.find(function (option) {
                    var _a;
                    return ((_a = option._id) === null || _a === void 0 ? void 0 : _a.toString()) === req.params.menuItemId;
                });
                if (!menuItem) {
                    return [2 /*return*/, res.status(404).send({ error: 'Menu Item not found' })];
                }
                option_1 = menuItem.options.find(function (option) {
                    var _a;
                    return ((_a = option._id) === null || _a === void 0 ? void 0 : _a.toString()) === req.params.optionId;
                });
                if (!option_1) {
                    return [2 /*return*/, res.status(404).send({ error: 'Not Found' })];
                }
                //  check and set the flavor 
                if (flavor.length !== 0) {
                    checkForFlavor(flavor, menuItem.options);
                    option_1.flavor = flavor;
                }
                if (option_1.unitOption.length + addOption.length - removeOption.length <= 0) {
                    return [2 /*return*/, res.status(400).send({ error: 'Empty option not allow, consider deleting the option' })];
                }
                // manage and add any option in the request
                if (addOption.length > 0) {
                    addOption.forEach(function (unitOption) {
                        if (option_1) {
                            checkForUnitOption(unitOption, option_1.unitOption);
                            option_1 === null || option_1 === void 0 ? void 0 : option_1.unitOption.unshift({
                                unit: unitOption.unit,
                                price: unitOption.price
                            });
                        }
                    });
                }
                // delete any option in the request
                if (removeOption.length > 0) {
                    removeOption.forEach(function (unitOption) {
                        if (option_1) {
                            option_1.unitOption = option_1.unitOption.filter(function (unit) {
                                var _a;
                                return ((_a = unit._id) === null || _a === void 0 ? void 0 : _a.toString()) !== unitOption._id;
                            });
                        }
                    });
                }
                if (updateOption.length > 0) {
                    updateOption.forEach(function (unitOption) {
                        if (option_1) {
                            // try to find and update the unit option
                            var tempUnit = option_1.unitOption.find(function (unit) {
                                var _a;
                                return ((_a = unit._id) === null || _a === void 0 ? void 0 : _a.toString()) === unitOption._id;
                            });
                            if (!tempUnit) {
                                return res.status(404).send({ error: 'Unit option not found' });
                            }
                            checkForUnitOption(unitOption, option_1.unitOption);
                            tempUnit.unit = unitOption.unit;
                            tempUnit.price = unitOption.price;
                        }
                    });
                }
                return [4 /*yield*/, result.save()];
            case 2:
                _c.sent();
                res.status(200).send({ option: option_1 });
                return [3 /*break*/, 4];
            case 3:
                error_7 = _c.sent();
                console.log(error_7.stack);
                res.status(400).send({ error: error_7.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
