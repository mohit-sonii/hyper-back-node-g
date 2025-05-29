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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_model_1 = require("../model/User.model");
const tokenCookieRedis_util_1 = require("../util/tokenCookieRedis.util");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rest = __rest(req.body, []);
    for (const i in rest) {
        const value = rest[i];
        if (typeof value === 'string' && value.trim().length === 0) {
            res.status(400).json({ status: 400, message: "Some required fields are missing !!" });
            return;
        }
    }
    try {
        const foundUser = yield User_model_1.User.findOne({
            email: rest.email
        });
        if (foundUser) {
            res.status(409).json({ status: 409, message: "User with this email already exists !!" });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(rest.password, 10);
        yield User_model_1.User.create({
            email: rest.email,
            password: hashedPassword
        });
        res.status(201).json({ status: 201, message: "User Created Successfully" });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: 500, message: "Internal Server Error" });
        return;
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { email, password } = req.body;
        if (email.trim().length === 0 || password.trim().length === 0) {
            res.status(400).json({ status: 400, message: "Either email or password is incorrect" });
            return;
        }
        const hasToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token_property;
        if (hasToken) {
            try {
                const result = (0, tokenCookieRedis_util_1.validateToken)(hasToken);
                if (result == null) {
                    res.status(200).json({ status: 200, message: "User Authenticated" });
                    return;
                }
                res.status(401).json({ status: 401, message: "Not Authenticated" });
                return;
            }
            catch (erorr) {
                res.status(500).json({ status: 500, message: "Unexpected Authentication Error" });
                console.log(erorr);
                return;
            }
        }
        const foundUser = yield User_model_1.User.findOne({
            email
        });
        if (!foundUser) {
            res.status(404).json({ status: 404, message: "User not found" });
            return;
        }
        if (yield bcrypt_1.default.compare(password, foundUser.password)) {
            (0, tokenCookieRedis_util_1.generateToken)(res, foundUser._id.toString());
            res.status(200).json({ status: 200, data: foundUser._id.toString(), message: "User Authenticated" });
            return;
        }
        else {
            res.status(401).json({ status: 401, message: "Incorrect email or password" });
            return;
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: 500, message: "Internal Server Eroror" });
        return;
    }
});
exports.login = login;
