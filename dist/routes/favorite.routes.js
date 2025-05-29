"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const favorite_controller_1 = require("../controller/favorite.controller");
const router = (0, express_1.Router)();
// I am assuming the favorites are working just like we have to just one click to add in fav and one click to unfav.
router.route("/").get(favorite_controller_1.getFav);
router.route("/add/:prop_id").get(favorite_controller_1.addFav);
router.route("/remove/:prop_id").delete(favorite_controller_1.removeFav);
exports.default = router;
