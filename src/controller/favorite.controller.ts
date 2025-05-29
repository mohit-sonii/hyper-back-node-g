import { Request, Response } from "express";
import { User } from "../model/User.model";
import { Properti } from "../model/Property.model";

export const addFav = async (req: Request, res: Response): Promise<void> => {
    try {
        const {user_id,prop_id} = req.params
        const user = await User.findById(user_id);
         if(user==null){
            res.status(404).json({status:404,message:"User not found !!"})
            return
        }
        const property = await Properti.findById(prop_id);
        if(property==null){
            res.status(404).json({status:404,message:"Property with this ID is not found"})
            return
        }
        await User.findByIdAndUpdate(user_id,{
            $push:{
                properties:prop_id
            }
        })
        res.status(200).json({status:200,message:"Added into Favorites"})
        return

    } catch (err: any) {
        console.log(err);
        res.status(500).json({ status: 500, message: "Internal Server Error" })
        return
    }
}

export const getFav = async (req: Request, res: Response): Promise<void> => {
    try {
        const {user_id} = req.params
        const user = await User.findById(user_id)
        if(user==null){
            res.status(404).json({status:404,message:"User not found !!"})
            return
        }
        // data to be in each form
        const fetchedProperties = await Promise.all(user.favorites.map(async(item)=>{
            const findProp = await Properti.findById(item._id);
            return findProp;
        }))
        const validProperties = fetchedProperties.filter(Boolean)

        res.status(200).json({status:200,message:"Data Fetched Successfully",data:validProperties})
        return
    } catch (err: any) {
        console.log(err);
        res.status(500).json({ status: 500, message: "Internal Server Error" })
        return
    }
}

export const removeFav = async (req: Request, res: Response): Promise<void> => {
    try {
        const {user_id,prop_id} = req.params;
        const user = await User.findById(user_id);
        const property = await Properti.findById(prop_id);
        if(user==null || property==null){
            res.status(404).json({
                status:404,
                message:"Requested data not found"
            })
        }
       await User.findByIdAndUpdate(user_id,{
        $pull:{
            favorites:prop_id
        }
       })
       res.status(200).json({status:200,message:"Data Deleted Successfully"})
       return;
       
    } catch (err: any) {
        console.log(err);
        res.status(500).json({ status: 500, message: "Internal Server Error" })
        return
    }
}