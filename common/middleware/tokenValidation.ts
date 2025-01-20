import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

const authenticateToken=(req:Request, res:Response, next:NextFunction)=>
{
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(401).json({message:"Access token missing or invalid"});
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET!);
        req.body.userId = decoded;
        next();
    } catch (error) {
        return res.status(403).json({message:"Invalid token"})
    }
}

export default authenticateToken;