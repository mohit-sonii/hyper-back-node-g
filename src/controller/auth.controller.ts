
import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import { User } from "../model/User.model";
import { generateToken, validateToken } from "../util/tokenCookieRedis.util";

export const register = async (req: Request, res: Response): Promise<void> => {
    const { ...rest } = req.body
    for (const i in rest) {
        const value = rest[i]
        if (typeof value === 'string' && value.trim().length === 0) {
            res.status(400).json({ status: 400, message: "Some required fields are missing !!" })
            return
        }
    }
    try {
        const foundUser = await User.findOne({
            email: rest.email
        })
        if (foundUser) {
            res.status(409).json({ status: 409, message: "User with this email already exists !!" })
            return
        }
        const hashedPassword = await bcrypt.hash(rest.password, 10);
        await User.create({
            email: rest.email,
            password: hashedPassword
        })

        res.status(201).json({ status: 201, message: "User Created Successfully" })
        return
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 500, message: "Internal Server Error" })
        return
    }
}

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body
        if (email.trim().length === 0 || password.trim().length === 0) {
            res.status(400).json({ status: 400, message: "Either email or password is incorrect" })
            return
        }
        const hasToken = req.cookies?.token_property
        if (hasToken) {
            try {
                const result = validateToken(hasToken);
                if (result == null) {
                    res.status(200).json({ status: 200, message: "User Authenticated" })
                    return
                }
                res.status(401).json({ status: 401, message: "Not Authenticated" })
                return
            } catch (erorr) {
                res.status(500).json({ status: 500, message: "Unexpected Authentication Error" })
                console.log(erorr)
                return
            }
        }
        const foundUser = await User.findOne({
            email
        })
        if (!foundUser) {
            res.status(404).json({ status: 404, message: "User not found" });
            return
        }
        if (await bcrypt.compare(password, foundUser.password)) {
            generateToken(res, foundUser._id.toString());
            res.status(200).json({ status: 200, data: foundUser._id.toString(), message: "User Authenticated" })
            return
        } else {
            res.status(401).json({ status: 401, message: "Incorrect email or password" })
            return
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 500, message: "Internal Server Eroror" })
        return
    }
}
