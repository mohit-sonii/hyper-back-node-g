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
exports.removeFav = exports.getFav = exports.addFav = void 0;
const User_model_1 = require("../model/User.model");
const Property_model_1 = require("../model/Property.model");
const addFav = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, prop_id } = req.params;
        const user = yield User_model_1.User.findById(userId);
        if (user == null) {
            res.status(404).json({ status: 404, message: "User not found !!" });
            return;
        }
        const property = yield Property_model_1.Properti.findById(prop_id);
        if (property == null) {
            res.status(404).json({ status: 404, message: "Property with this ID is not found" });
            return;
        }
        yield User_model_1.User.findByIdAndUpdate(userId, {
            $push: {
                properties: prop_id
            }
        });
        res.status(200).json({ status: 200, message: "Added into Favorites" });
        return;
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: 500, message: "Internal Server Error" });
        return;
    }
});
exports.addFav = addFav;
const getFav = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.params;
        const user = yield User_model_1.User.findById(user_id);
        if (user == null) {
            res.status(404).json({ status: 404, message: "User not found !!" });
            return;
        }
        // data to be in each form
        const fetchedProperties = yield Promise.all(user.favorites.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const findProp = yield Property_model_1.Properti.findById(item._id);
            return findProp;
        })));
        const validProperties = fetchedProperties.filter(Boolean);
        res.status(200).json({ status: 200, message: "Data Fetched Successfully", data: validProperties });
        return;
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: 500, message: "Internal Server Error" });
        return;
    }
});
exports.getFav = getFav;
const removeFav = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, prop_id } = req.params;
        const user = yield User_model_1.User.findById(userId);
        const property = yield Property_model_1.Properti.findById(prop_id);
        if (user == null || property == null) {
            res.status(404).json({
                status: 404,
                message: "Requested data not found"
            });
        }
        yield User_model_1.User.findByIdAndUpdate(userId, {
            $pull: {
                favorites: prop_id
            }
        });
        res.status(200).json({ status: 200, message: "Data Deleted Successfully" });
        return;
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: 500, message: "Internal Server Error" });
        return;
    }
});
exports.removeFav = removeFav;
