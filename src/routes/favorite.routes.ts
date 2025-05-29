import { Router } from "express";
import { addFav, getFav, removeFav } from "../controller/favorite.controller";
import { authMiddleware } from "../middleware/auth.middleware";


// with this we can have the access to the iniital part of the route that is coming from '/app.ts'. In this route file we must have user_id in the params and that user id is mentioned in the app.ts so to access that  params I must also have in this path, so it will add that path in this route, so that we can access it in params
const router = Router({mergeParams:true})

// I am assuming the favorites are working just like we have to just one click to add in fav and one click to unfav.

router.route("/").get(authMiddleware,getFav)
router.route("/add/:prop_id").get(authMiddleware,addFav)
router.route("/remove/:prop_id").delete(authMiddleware,removeFav)

export default router;