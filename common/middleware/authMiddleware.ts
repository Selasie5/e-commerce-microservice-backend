import {NextFunction, Request, Response} from "express"
import jwt from "jsonwebtoken"

interface AuthRequest extends Request{
    userId?:number
}

export const authenticate=(req:AuthRequest, res:Response, next:NextFunction)=>
{
    const token = req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({message:"Unathorized"})
    }
    try {
       const secret = process.env.JWT_SECRET;
       if (!secret) {
           return res.status(500).json({ message: "Internal server error" });
       }
       const decoded = jwt.verify(token, secret) as unknown as { userId: number };
       req.userId = decoded.userId;
    } catch (error) {
        res.status(400).json({"message":"invalid token"})
    }
}