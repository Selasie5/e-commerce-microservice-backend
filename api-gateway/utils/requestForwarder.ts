import axios from "axios"
import { Request, Response } from "express"

export const forwardRequest = async(req:Request, res:Response, serviceURl:string)=>
{
    try {
        const response = await axios({
            method:req.method,
            url:serviceURl,
            data: req.body,
            headers:req.headers
        })
        res.status(response.status).json(response.data)
    } catch (error:any) {
        console.log("Error: Error forwardind request")
        res.status(error.response.status).json({
            error:"Error forwarding request",
            details: error.message
        })
    }
}