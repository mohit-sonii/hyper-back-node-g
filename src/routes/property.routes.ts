import {Router} from 'express'
import { authMiddleware } from '../middleware/auth.middleware';
import { addProperty, deleteProperty, getProperty, searchProperty, updateProperty } from '../controller/property.controller';

const router = Router()

router.route('/add').post(authMiddleware,addProperty)
router.route("/:prop_id").get(getProperty) // it is not mentioned that who has acrss to this route
router.route("/update/:prop_id").patch(authMiddleware,updateProperty)
router.route("/delete/:prop_id").delete(authMiddleware,deleteProperty)
router.route("/").get(authMiddleware,searchProperty)


export default router;