"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const favorite_controller_1 = require("../controller/favorite.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)({ mergeParams: true });
// I am assuming the favorites are working just like we have to just one click to add in fav and one click to unfav.
router.route("/").get(auth_middleware_1.authMiddleware, favorite_controller_1.getFav);
router.route("/add/:prop_id").get(auth_middleware_1.authMiddleware, favorite_controller_1.addFav);
router.route("/remove/:prop_id").delete(auth_middleware_1.authMiddleware, favorite_controller_1.removeFav);
exports.default = router;
