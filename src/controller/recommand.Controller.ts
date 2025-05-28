import { Request, Response } from 'express'
import { User } from '../model/User.model';
import { validateToken } from '../util/tokenCookieRedis.util';
import { Properti } from '../model/Property.model';


export const findUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.query;
        const user = await User.findOne({ email })
        if (user == null) {
            res.status(404).json({ status: 404, message: "User not found" })
            return
        }
        const returnedUser = {
            _id: user._id,
            email: user.email
        }
        res.status(200).json({ status: 200, message: "User Fetched Successfully", data: returnedUser })
        return

    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 500, message: "Internal Server Error" })
        return
    }
}

export const recommed = async (req: Request, res: Response): Promise<void> => {
    try {
        const { prop_id, rec_user_id } = req.params;
        const token = req.cookies?.token_property
        if (!token) {
            res.status(401).json({ status: 401, message: "Unauthorized" })
            return
        }
        const decode = await validateToken(token)
        if (decode == null) {
            res.status(401).json({ status: 401, message: "Unauthorized" })
            return
        }
        const token_id = decode?.id
        const [recommender, recipient, property] = await Promise.all([
            User.findById(token_id),
            User.findById(rec_user_id),
            Properti.findById(prop_id)
        ]);

        if (!recommender || !recipient || !property) {
            res.status(404).json({ status: 404, message: "User or Property not found" });
            return;
        }

        const alreadyRecommended = recipient.recommendationsReceived.some(
            (r: any) =>
                r.from.toString() === token_id &&
                r.property.toString() === prop_id
        );

        if (alreadyRecommended) {
            res.status(400).json({ status: 400, message: "Property already recommended to this user" });
            return;
        }

        recipient.recommendationsReceived.push({
            from: token_id,
            property: prop_id
        });

        await recipient.save();
        res.status(201).json({ status: 201, message: "Recommend Successfully" })
        return

    } catch (err: any) {
        console.log(err);
        res.status(500).json({ status: 500, message: "Internal Server Error" })
        return
    }
}

export const getRecommendations = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.cookies?.token_property
        if (!token) {
            res.status(401).json({
                status: 401, message: "Unauthorized"
            }
            )
        }
        const decode = await validateToken(token);
        if(decode==null){
            res.status(404).json({status:404,message:"Invalid Session"})
            return
        }
        const user = await User.findById(decode.id);
        if(user==null){
            res.status(404).json({status:404,message:"User not found"})
            return
        }
        const recommendProperty = await Promise.all(user.recommendationsReceived.map(async(item)=>{
            const findProp = await Properti.findById(item._id);
            return findProp;
        }))
        
        const validProperties = recommendProperty.filter(Boolean);
        res.status(200).json({status:200,message:"Data Fetched Successfully",data:validProperties})
        return

    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 500, message: "Internal Server Error" })
        return
    }
}