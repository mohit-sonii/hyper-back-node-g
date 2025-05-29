import { Request, Response } from 'express'
import { validateToken } from '../util/tokenCookieRedis.util';
import { generatePropertyId } from '../util/CounterPropertyValue.util';
import { Properti } from '../model/Property.model';
import { User } from '../model/User.model';

export const addProperty = async (req: Request, res: Response): Promise<void> => {
    const { ...rest } = req.body;
    for (const i in rest) {
        const value = rest[i]
        if (!Array.isArray(value) && typeof value !=='number' && typeof value === 'string' && value.trim().length === 0) {
            res.status(400).json({ satus: 400, message: "Some required fields are missing !!" })
            return
        }
    }
    try {
        const token = req.cookies?.token_property;
        if (!token) {
            res.status(401).json({ status: 401, message: "Unauthorized" });
            return;
        }
        const decode = await validateToken(token)
        const id = decode?.id;
        const propertyId = await generatePropertyId();
        try {
            const newProperty = await Properti.create({
                id: propertyId,
                title: rest.id,
                type: rest.type,
                price: rest.price,
                state: rest.state,
                city: rest.city,
                areaSqFt: rest.areaSqFt,
                bedrooms: parseInt(rest.bedrooms),
                bathrooms: parseInt(rest.bathrooms),
                amenities: rest.amenities,
                furnished: rest.furnished,
                availableFrom: new Date(rest.availableFrom),
                listedBy: rest.listedBy,
                tags: rest.tags,
                colorTheme: rest.colorTheme,
                rating: rest.rating,
                isVerified: rest.isVerified,
                listingType: rest.listingType,
                createdBy: id
            })
            await User.findByIdAndUpdate(id, {
                $push: {
                    properties: newProperty._id
                }
            })
            res.status(201).json({ status: 201, message: "Property Created Successfully" })
            return;
        } catch (err: any) {
            console.log(err)
            res.status(500).json({ status: 500, message: "Error creating a property" })
            return;
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: 500, message: "Internal Server Error" })
        return;
    }
}

export const updateProperty = async (req: Request, res: Response): Promise<void> => {

    try {
        const { prop_id } = req.params
        const { ...rest } = req.body
        const token = req.cookies?.token_property;
        if (!token) {
            res.status(401).json({ status: 401, message: "Unauthorized" });
            return;
        }
        const decode = await validateToken(token)
        const userId = decode?.id;

        const currentUser = await User.findById(userId);
        if (!currentUser) {
            res.status(404).json({ status: 404, message: "User not found" });
            return
        }

        const ownsProperty = currentUser.properties.some(
            (prop) => prop.toString() === prop_id
        );

        if (!ownsProperty) {
            res.status(404).json({
                status: 404,
                message: "No such property associated with this user",
            });
            return
        }

        const updatedProperty = await Properti.findByIdAndUpdate(
            prop_id,
            { $set: rest },
            { new: true }
        );
        if (!updatedProperty) {
            res
                .status(404)
                .json({ status: 404, message: "Property not found" });
            return
        }

        res.status(200).json({
            status: 200,
            message: "Property updated successfully",
        });

        return

    } catch (err) {
        console.log(err)
        res.status(500).json({ status: 500, message: "Internal Server Eroror" })
        return;
    }
}

export const deleteProperty = async (req: Request, res: Response): Promise<void> => {

    try {
        const { prop_id } = req.params

        const token = req.cookies?.token_property;
        if (!token) {
            res.status(401).json({ status: 401, message: "Unauthorized" });
            return;
        }
        const decode = await validateToken(token)
        const userId = decode?.id;

        const currentUser = await User.findById(userId);
        if (!currentUser) {
            res.status(404).json({ status: 404, message: "User not found" });
            return
        }

        const ownsProperty = currentUser.properties.some(
            (prop) => prop.toString() === prop_id
        );

        if (!ownsProperty) {
            res.status(404).json({
                status: 404,
                message: "No such property associated with this user",
            });
            return
        }

        const deleteProperty = await Properti.findByIdAndDelete(
            prop_id
        );
        if (!deleteProperty) {
            res
                .status(404)
                .json({ status: 404, message: "Property not found" });
            return
        }

        await User.findByIdAndUpdate(userId, {
            $pull: {
                properties: prop_id
            }
        })
        res.status(200).json({
            status: 200,
            message: "Property deleted successfully",
        });

        return
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: 500, message: "Internal Server Eroror" })
        return;
    }
}

export const getProperty = async (req: Request, res: Response): Promise<void> => {

    try {
        const { prop_id } = req.params
        const property = await Properti.findById(prop_id)
        if (!property) {
            res.status(404).json({ status: 404, message: "No Such property found with this Id" })
            return
        }
        res.status(200).json({ status: 200, message: "Property Found", property })
        return

    } catch (err) {
        console.log(err)
        res.status(500).json({ status: 500, message: "Internal Server Eroror" })
        return;
    }
}

export const searchProperty = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            id,
            title,
            propertyType,
            price,
            state,
            city,
            areaSqFt,
            bedrooms,
            bathrooms,
            furnished,
            availableFrom,
            listedBy,
            colorTheme,
            amenities,
            tags,
            isVerified,
            listingType
        } = req.params

        let query: any = {};
        if (id) query.id = id
        if (listedBy) query.listedBy = listedBy
        if (availableFrom) query.availableFrom = new Date(availableFrom);
        if (title) query.title = title
        if (isVerified) query.isVerified = isVerified === "true"
        if (colorTheme) query.colorTheme = colorTheme
        if (listingType) query.listingType = listingType;
        if (city) query.city = city;
        if (state) query.state = state
        if (bedrooms) query.bedrooms = Number(bedrooms);
        if (bathrooms) query.bathrooms = Number(bathrooms);
        if (furnished) query.furnished = furnished === "true";
        if (propertyType) query.type = propertyType;

        if (price) {
            query.price = { $gte: Number(price) }
        }

        if (areaSqFt) {
            query.areaSqFt = { $gte: Number(areaSqFt) }
        }

        if (tags) {
            const tagsArray = tags.split(",");
            query.tags = { $in: tagsArray };
        }

        if (amenities) {
            const amenitiesArray = amenities.split(",");
            query.amenities = { $in: amenitiesArray };
        }

        const properties = await Properti.find(query);

        res.status(200).json({
            status: 200,
            count: properties.length,
            data: properties,
        });
        return
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 500, message: "Internal Server Error" })
        return;
    }
}
