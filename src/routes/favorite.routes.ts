import { Router } from "express";
import { addFav, getFav, removeFav } from "../controller/favorite.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router({mergeParams:true})

// I am assuming the favorites are working just like we have to just one click to add in fav and one click to unfav.

router.route("/").get(authMiddleware,getFav)
router.route("/add/:prop_id").get(authMiddleware,addFav)
router.route("/remove/:prop_id").delete(authMiddleware,removeFav)

export default router;