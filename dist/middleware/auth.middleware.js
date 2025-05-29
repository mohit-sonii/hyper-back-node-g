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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const tokenCookieRedis_util_1 = require("../util/tokenCookieRedis.util");
const redis_1 = require("../util/redis");
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token_property;
        if (!token) {
            res.status(401).json({ status: 401, message: "Unauthorized" });
            return;
        }
        try {
            const decode = yield (0, tokenCookieRedis_util_1.validateToken)(token);
            if (decode == null) {
                res.status(401).json({ status: 401, message: 'Unauthorized' });
                return;
            }
            const redisData = yield redis_1.redis.get(`session_for_property:${decode.id}`);
            if (redisData) {
                if (decode.id !== redisData) {
                    res.status(401).json({ status: 401, message: 'Unauthorized' });
                    return;
                }
            }
            else {
                res.status(401).json({ status: 401, message: 'Unauthorized' });
                return;
            }
            // this is giving TS error which is unresolved even after 3 hours of debugging. os I am doing all these stuff using token and cookie only.
            // req.userId=redisData
        }
        catch (err) {
            res.status(400).json({ status: 400, message: "Something went wrong" });
            return;
        }
        next();
    }
    catch (error) {
        res.status(500).json({ status: 500, message: "UnExpected Server Error" });
        console.log(error);
        return;
    }
});
exports.authMiddleware = authMiddleware;
