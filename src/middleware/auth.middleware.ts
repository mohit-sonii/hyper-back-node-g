import { NextFunction, Request, Response } from "express";
import { validateToken } from "../util/tokenCookieRedis.util";
import { redis } from "../util/redis";

export const authMiddleware = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   try {
      const token = req.cookies?.token_property;
      if (!token) {
         res.status(401).json({ status: 401, message: "Unauthorized" });
         return;
      }
      try {
         const decode = await validateToken(token);
         if (decode == null) {
            res.status(401).json({ status: 401, message: 'Unauthorized' })
            return;
         }

         const redisData = await redis.get(`session_for_property:${decode.id}`)
         if (redisData) {
            if (decode.id !== redisData) {
               res.status(401).json({ status: 401, message: 'Unauthorized' })
               return
            }
         } else {
            res.status(401).json({ status: 401, message: 'Unauthorized' })
            return
         } 
         // this is giving TS error which is unresolved even after 3 hours of debugging. os I am doing all these stuff using token and cookie only.

         // req.userId=redisData
      } catch (err) {
         res.status(400).json({ status: 400, message: "Something went wrong" });
         return;
      }
      next();
   } catch (error: any) {
      res.status(500).json({ status: 500, message: "UnExpected Server Error" });
      console.log(error);
      return;
   }
};
