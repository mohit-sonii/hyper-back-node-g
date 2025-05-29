"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const property_controller_1 = require("../controller/property.controller");
const router = (0, express_1.Router)();
router.route('/add').post(auth_middleware_1.authMiddleware, property_controller_1.addProperty);
router.route("/:prop_id").get(property_controller_1.getProperty); // it is not mentioned that who has acrss to this route
router.route("/update/:prop_id").patch(auth_middleware_1.authMiddleware, property_controller_1.updateProperty);
router.route("/delete/:prop_id").delete(auth_middleware_1.authMiddleware, property_controller_1.deleteProperty);
router.route("/").get(auth_middleware_1.authMiddleware, property_controller_1.searchProperty);
exports.default = router;
