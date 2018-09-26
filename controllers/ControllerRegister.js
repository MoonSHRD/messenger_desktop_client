"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
Object.defineProperty(exports, "__esModule", { value: true });
var Queue = require("better-queue");
var Controllers = {
    AuthController: require(__dirname + '/Auth/AuthController'),
    ChatsController: require(__dirname + '/Main/ChatsController'),
    MessagesController: require(__dirname + '/Main/MessagesController'),
    MenuController: require(__dirname + '/Main/MenuController'),
};
var ControllerRegister = /** @class */ (function () {
    function ControllerRegister(window) {
        this.Controllers = [];
        this.window = window;
        this.queue = new Queue(function (fn, cb) {
            return __awaiter(this, void 0, void 0, function () {
                var e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, fn()];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            e_1 = _a.sent();
                            console.log(e_1);
                            return [3 /*break*/, 3];
                        case 3:
                            cb();
                            return [2 /*return*/];
                    }
                });
            });
        });
    }
    // private async sync_controller_initianizer(){
    //     while (true){
    //         console.log(this.func_query);
    //         let func=this.func_query.shift();
    //         if (func) {
    //             try {
    //                 await func();
    //             } catch (e) {
    //                 console.log(e);
    //             }
    //         }
    //     }
    // }
    ControllerRegister.getInstance = function (window) {
        if (window === void 0) { window = null; }
        if (!ControllerRegister.instance) {
            if (!window)
                throw new Error('must pass window parameter');
            ControllerRegister.instance = new ControllerRegister(window);
            // ControllerRegister.instance.sync_controller_initianizer();
        }
        return ControllerRegister.instance;
    };
    ControllerRegister.prototype.get_controller = function (controller) {
        if (!this.Controllers[controller]) {
            this.Controllers[controller] = new Controllers[controller](this.window);
        }
        return this.Controllers[controller];
    };
    ControllerRegister.prototype.run_controller = function (controller, func) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.queue.push(function () { return __awaiter(_this, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, (_a = this.get_controller(controller))[func].apply(_a, args)];
                            case 1: return [2 /*return*/, _b.sent()];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    ControllerRegister.prototype.run_controller_synchronously = function (controller, func) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (_a = this.get_controller(controller))[func].apply(_a, args)];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    ControllerRegister.prototype.get_controller_parameter = function (controller, parameter) {
        if (!this.Controllers[controller]) {
            this.Controllers[controller] = new Controllers[controller](this.window);
        }
        return this.Controllers[controller][parameter];
    };
    return ControllerRegister;
}());
exports.ControllerRegister = ControllerRegister;
//# sourceMappingURL=ControllerRegister.js.map