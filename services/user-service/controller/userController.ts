import { Request, Response } from "express";
import primsa from "../../../common/db.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

export const register = async(req:Request, res:Response)=>
{
    const {email, password, firstName, lastName}= req.body;

    const hashedPassword =  await bcrypt.hash(password, 10)
try {
    
    const user = await primsa.user.create({
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