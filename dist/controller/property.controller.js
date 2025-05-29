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
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchProperty = exports.getProperty = exports.deleteProperty = exports.updateProperty = exports.addProperty = void 0;
const tokenCookieRedis_util_1 = require("../util/tokenCookieRedis.util");
const CounterPropertyValue_util_1 = require("../util/CounterPropertyValue.util");
const Property_model_1 = require("../model/Property.model");
const User_model_1 = require("../model/User.model");
const addProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const rest = __rest(req.body, []);
    for (const i in rest) {
        const value = rest[i];
        if (!Array.isArray(value) && typeof value !== 'number' && typeof value === 'string' && value.trim().length === 0) {
            res.status(400).json({ satus: 400, message: "Some required fields are missing !!" });
            return;
        }
    }
    try {
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token_property;
        if (!token) {
            res.status(401).json({ status: 401, message: "Unauthorized" });
            return;
        }
        const decode = yield (0, tokenCookieRedis_util_1.validateToken)(token);
        const id = decode === null || decode === void 0 ? void 0 : decode.id;
        const propertyId = yield (0, CounterPropertyValue_util_1.generatePropertyId)();
        try {
            const newProperty = yield Property_model_1.Properti.create({
                id: propertyId,
                title: rest.title,
                type: rest.type,
                price: rest.price,
                state: rest.state,
                city: rest.city,
                areaSqFt: rest.areaSqFt,
                bedrooms: rest.bedrooms,
                bathrooms: rest.bathrooms,
                amenities: rest.amenities ? rest.amenities : [],
                furnished: rest.furnished,
                // availableFrom: rest.availableFrom? new Date(rest.availableFrom): new Date(),
                listedBy: rest.listedBy,
                tags: rest.tags ? rest.tags : [],
                colorTheme: rest.colorTheme,
                rating: rest.rating,
                isVerified: rest.isVerified,
                listingType: rest.listingType,
                createdBy: id
            });
            yield User_model_1.User.findByIdAndUpdate(id, {
                $push: {
                    properties: newProperty._id
                }
            });
            res.status(201).json({ status: 201, message: "Property Created Successfully" });
            return;
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "Error creating a property" });
            return;
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: 500, message: "Internal Server Error" });
        return;
    }
});
exports.addProperty = addProperty;
const updateProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { prop_id } = req.params;
        const rest = __rest(req.body, []);
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token_property;
        if (!token) {
            res.status(401).json({ status: 401, message: "Unauthorized" });
            return;
        }
        const decode = yield (0, tokenCookieRedis_util_1.validateToken)(token);
        const userId = decode === null || decode === void 0 ? void 0 : decode.id;
        const currentUser = yield User_model_1.User.findById(userId);
        if (!currentUser) {
            res.status(404).json({ status: 404, message: "User not found" });
            return;
        }
        const ownsProperty = currentUser.properties.some((prop) => prop.toString() === prop_id);
        if (!ownsProperty) {
            res.status(404).json({
                status: 404,
                message: "No such property associated with this user",
            });
            return;
        }
        const updatedProperty = yield Property_model_1.Properti.findByIdAndUpdate(prop_id, { $set: rest }, { new: true });
        if (!updatedProperty) {
            res
                .status(404)
                .json({ status: 404, message: "Property not found" });
            return;
        }
        res.status(200).json({
            status: 200,
            message: "Property updated successfully",
        });
        return;
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: 500, message: "Internal Server Eroror" });
        return;
    }
});
exports.updateProperty = updateProperty;
const deleteProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { prop_id } = req.params;
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token_property;
        if (!token) {
            res.status(401).json({ status: 401, message: "Unauthorized" });
            return;
        }
        const decode = yield (0, tokenCookieRedis_util_1.validateToken)(token);
        const userId = decode === null || decode === void 0 ? void 0 : decode.id;
        const currentUser = yield User_model_1.User.findById(userId);
        if (!currentUser) {
            res.status(404).json({ status: 404, message: "User not found" });
            return;
        }
        const ownsProperty = currentUser.properties.some((prop) => prop.toString() === prop_id);
        if (!ownsProperty) {
            res.status(404).json({
                status: 404,
                message: "No such property associated with this user",
            });
            return;
        }
        const deleteProperty = yield Property_model_1.Properti.findByIdAndDelete(prop_id);
        if (!deleteProperty) {
            res
                .status(404)
                .json({ status: 404, message: "Property not found" });
            return;
        }
        yield User_model_1.User.findByIdAndUpdate(userId, {
            $pull: {
                properties: prop_id
            }
        });
        res.status(200).json({
            status: 200,
            message: "Property deleted successfully",
        });
        return;
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: 500, message: "Internal Server Eroror" });
        return;
    }
});
exports.deleteProperty = deleteProperty;
const getProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { prop_id } = req.params;
        const property = yield Property_model_1.Properti.findById(prop_id);
        if (!property) {
            res.status(404).json({ status: 404, message: "No Such property found with this Id" });
            return;
        }
        res.status(200).json({ status: 200, message: "Property Found", property });
        return;
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: 500, message: "Internal Server Eroror" });
        return;
    }
});
exports.getProperty = getProperty;
const searchProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, title, propertyType, price, state, city, areaSqFt, bedrooms, bathrooms, furnished, 
        // availableFrom,
        listedBy, colorTheme, amenities, tags, isVerified, listingType } = req.params;
        let query = {};
        if (id)
            query.id = id;
        if (listedBy)
            query.listedBy = listedBy;
        // if (availableFrom) query.availableFrom = new Date(availableFrom);
        if (title)
            query.title = title;
        if (isVerified)
            query.isVerified = isVerified === "true";
        if (colorTheme)
            query.colorTheme = colorTheme;
        if (listingType)
            query.listingType = listingType;
        if (city)
            query.city = city;
        if (state)
            query.state = state;
        if (bedrooms)
            query.bedrooms = Number(bedrooms);
        if (bathrooms)
            query.bathrooms = Number(bathrooms);
        if (furnished)
            query.furnished = furnished === "true";
        if (propertyType)
            query.type = propertyType;
        if (price) {
            query.price = { $gte: Number(price) };
        }
        if (areaSqFt) {
            query.areaSqFt = { $gte: Number(areaSqFt) };
        }
        if (tags) {
            const tagsArray = tags.split(",");
            query.tags = { $in: tagsArray };
        }
        if (amenities) {
            const amenitiesArray = amenities.split(",");
            query.amenities = { $in: amenitiesArray };
        }
        const properties = yield Property_model_1.Properti.find(query);
        res.status(200).json({
            status: 200,
            count: properties.length,
            data: properties,
        });
        return;
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: 500, message: "Internal Server Error" });
        return;
    }
});
exports.searchProperty = searchProperty;
