import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const protectRoute =async(req,res,next)=>{
    try
{
    const token =req.cookies.jwt;
    if(!token){
        return res.status(401).json({message:"unauthorized "})
    }
    const decode =jwt.verify(token,process.env.JWT_SECRET)
    if(!decode){
        return res.status(401).json({message:"unauthorized "})
    }
    const user =await User.findById(decode.userId).select("-password")
    if(!user){
        return res.status(401).json({message:"you are fraud"})
    }
    req.user= user;
    next()
}
catch(error){
    console.log(error);
    res.status(400).json({message:"internal server error"})
}}