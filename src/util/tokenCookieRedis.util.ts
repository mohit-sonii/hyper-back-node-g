import jwt from "jsonwebtoken";
import { Response } from "express";
import { redis } from "./redis";

const secret = process.env.SECRET_KEY || "JavaPythonRustFlaskRubyOnRailsBigChill";

// generate a token
export const generateToken = async(res: Response, id: string) => {

   const token = jwt.sign({ id }, secret, {
      expiresIn: "24h",
   });
   res.cookie("token_property", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 1000 * 24 * 60 * 60,
   });
   
   await redis.set( `session_for_property:${id}` ,id,'EX',24*60*60)
   
};

export interface JWT {
   id: string;
}

export const validateToken = async (token: string) => {
   try{
      return jwt.verify(token, process.env.SECRET_KEY || secret) as JWT
   } catch(err){
      return null
   }
};