import { Request, Response } from "express";
import prisma from "../../../common/db.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

interface CustomRequest extends Request {
    userId?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "default-secret";
//Handle user registration
export const register = async(req:Request, res:Response)=>
{
    const {email, password, firstName, lastName}= req.body;

    const hashedPassword =  await bcrypt.hash(password, 10)
try {
    
    const user = await prisma.user.create({
        data:{
            email, 
            password:hashedPassword,
            firstName,
            lastName
        }
    });

    res.status(201).json(user);
} catch (error) {
    res.status(500).json({error:"Internal server error"});
}
    
}

//This handle user logins

export const login = async(req:Request, res:Response):Promise<void>=>
{
    const {email, passowrd}= req.body;
    try {
        const user = await prisma.user.findUnique({
            where:{
                email
            }
        })
        if(!user || !await bcrypt.compare(passowrd, user.password))
        {
            res.status(401).json({error:"Invalid user credentials"})
            
        }
    } catch (error) {
        res.status(500).json({error:"Internal server error"});
    }
}

export const getProfile =async(req: CustomRequest, res:Response):Promise<void> =>{
 const userId = req.userId;
 try {
    const user = await prisma.user.findUnique({
        where:{
            id: userId ? parseInt(userId, 10) : undefined
        }
    });
    res.status(200).json(user);
 } catch (error) {
    res.status(500).json({ error: "Internal server error" });
 } 
}
