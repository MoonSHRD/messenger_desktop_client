"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const Controller_1 = require("../Controller");
const fs = require("fs");
var encryptor = require('file-encryptor');
class AccountController extends Controller_1.Controller {
    encrypt_db() {
        return __awaiter(this, void 0, void 0, function* () {
            let me = yield this.get_me();
            let key = me.privKey;
            if (fs.existsSync(`${__dirname}/../../sqlite/data.db`))
                encryptor.encryptFile(`${__dirname}/../../sqlite/data.db`, `${__dirname}/../../sqlite/encrypted.db`, key, function (err) { });
            else
                console.log("File for decrypt not exist");
        });
    }
    decrypt_db() {
        return __awaiter(this, void 0, void 0, function* () {
            let me = yield this.get_me();
            let key = me.privKey;
            if (fs.existsSync(`${__dirname}/../../sqlite/encrypted.db`))
                encryptor.decryptFile(`${__dirname}/../../sqlite/encrypted.db`, `${__dirname}/../../sqlite/test.db`, key, function (err) { });
            else
                console.log("File for encrypt not exist");
        });
    }
}
module.exports = AccountController;
//# sourceMappingURL=AccountController.js.map