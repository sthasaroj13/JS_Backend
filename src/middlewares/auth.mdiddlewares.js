import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import  Jwt  from "jsonwebtoken";
import { User } from "../models/user.models.js"
// if res is not use we used _ 
export const vertifyJWT = asyncHandler(async(req,_,next)=>{
 try {
    const Token =   req.cookie?.accessToken|| req.header("Authorization").replace("bearer ","")
   
    if (!Token) {
       throw new ApiError(401 , "unauthorized request")
       
    }
   const decodedToken = Jwt.verify(Token,process.env.ACCESS_TOKEN_SECRET)
   const user =await User.findById(decodedToken?._id).select("-password -refreshToken")
   
   if (!user) {
       throw new ApiError(401 ,"invalid access token")
   }
   req.user =user;
   next()
 } catch (error) {
    throw new ApiError(401, error?.message || "invalid access")
 }
})
