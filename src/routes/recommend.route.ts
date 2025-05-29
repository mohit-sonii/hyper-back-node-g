import { Router } from "express";
import { findUser, getRecommendations, recommed } from "../controller/recommand.Controller";
import { authMiddleware } from "../middleware/auth.middleware";
const router = Router()


router.route("/").post(authMiddleware,findUser)
router.route("/:prop_id/:rec_user_id").post(authMiddleware,recommed)
router.route("/recommendations").get(authMiddleware,getRecommendations)

export default router;