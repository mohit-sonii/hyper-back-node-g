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
exports.getRecommendations = exports.recommed = exports.findUser = void 0;
const User_model_1 = require("../model/User.model");
const tokenCookieRedis_util_1 = require("../util/tokenCookieRedis.util");
const Property_model_1 = require("../model/Property.model");
const findUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield User_model_1.User.findOne({ email });
        if (user == null) {
            res.status(404).json({ status: 404, message: "User not found" });
            return;
        }
        const returnedUser = {
            _id: user._id,
            email: user.email
        };
        res.status(200).json({ status: 200, message: "User Fetched Successfully", data: returnedUser });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: 500, message: "Internal Server Error" });
        return;
    }
});
exports.findUser = findUser;
const recommed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { prop_id, rec_user_id } = req.params;
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token_property;
        if (!token) {
            res.status(401).json({ status: 401, message: "Unauthorized" });
            return;
        }
        const decode = yield (0, tokenCookieRedis_util_1.validateToken)(token);
        if (decode == null) {
            res.status(401).json({ status: 401, message: "Unauthorized" });
            return;
        }
        const token_id = decode === null || decode === void 0 ? void 0 : decode.id;
        const [recommender, recipient, property] = yield Promise.all([
            User_model_1.User.findById(token_id),
            User_model_1.User.findById(rec_user_id),
            Property_model_1.Properti.findById(prop_id)
        ]);
        if (!recommender || !recipient || !property) {
            res.status(404).json({ status: 404, message: "User or Property not found" });
            return;
        }
        const alreadyRecommended = recipient.recommendationsReceived.some((r) => r.from.toString() === token_id &&
            r.property.toString() === prop_id);
        if (alreadyRecommended) {
            res.status(400).json({ status: 400, message: "Property already recommended to this user" });
            return;
        }
        recipient.recommendationsReceived.push({
            from: token_id,
            property: prop_id
        });
        yield recipient.save();
        res.status(201).json({ status: 201, message: "Recommend Successfully" });
        return;
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: 500, message: "Internal Server Error" });
        return;
    }
});
exports.recommed = recommed;
const getRecommendations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token_property;
        if (!token) {
            res.status(401).json({
                status: 401, message: "Unauthorized"
            });
        }
        const decode = yield (0, tokenCookieRedis_util_1.validateToken)(token);
        if (decode == null) {
            res.status(404).json({ status: 404, message: "Invalid Session" });
            return;
        }
        const user = yield User_model_1.User.findById(decode.id);
        if (user == null) {
            res.status(404).json({ status: 404, message: "User not found" });
            return;
        }
        const recommendProperty = yield Promise.all(user.recommendationsReceived.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const findProp = yield Property_model_1.Properti.findById(item._id);
            return findProp;
        })));
        const validProperties = recommendProperty.filter(Boolean);
        res.status(200).json({ status: 200, message: "Data Fetched Successfully", data: validProperties });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: 500, message: "Internal Server Error" });
        return;
    }
});
exports.getRecommendations = getRecommendations;
