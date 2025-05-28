import { Router } from "express";
import { addFav, getFav, removeFav } from "../controller/favorite.controller";

const router = Router()

// I am assuming the favorites are working just like we have to just one click to add in fav and one click to unfav.

router.route("/").get(getFav)
router.route("/add/:prop_id").get(addFav)
router.route("/remove/:prop_id").delete(removeFav)

export default router;