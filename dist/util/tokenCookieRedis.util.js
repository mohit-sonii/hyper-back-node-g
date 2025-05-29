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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_1 = require("./redis");
const secret = process.env.SECRET_KEY || "JavaPythonRustFlaskRubyOnRailsBigChill";
// generate a token
const generateToken = (res, id) => __awaiter(void 0, void 0, void 0, function* () {
    const token = jsonwebtoken_1.default.sign({ id }, secret, {
        expiresIn: "24h",
    });
    res.cookie("token_property", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1000 * 24 * 60 * 60,
    });
    yield redis_1.redis.set(`session_for_property:${id}`, id, 'EX', 24 * 60 * 60);
});
exports.generateToken = generateToken;
const validateToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY || secret);
    }
    catch (err) {
        return null;
    }
});
exports.validateToken = validateToken;
