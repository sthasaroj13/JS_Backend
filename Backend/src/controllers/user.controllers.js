import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/CloudinaryFileUpload.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import  Jwt  from "jsonwebtoken";

const generateAccessTokenandRefreshToken = async (userId) => {
  try {
    //find userid from database
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    //save refreshToken in DB so that we dont have to ask for password again and again to user
    user.refreshToken = refreshToken;
    //it save the refresh token in DB
    await user.save({ validateBeforeSave: false });
    // it generate accessToken and refreshToken
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend
  //validation -not empty
  //check if user already exists :Username and email
  //check for image and check for avtar
  // upload them in cloudinary ,avtar

  //  create user object  - create entry in db
  //remvove password and refresh token field  from response
  //check for user creation
  // return response

  //get user details from frontend
  const { fullName, username, email, password } = req.body;
  // console.log(" your email :", email);

  //validation -not empty
  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "all field is required");
  }
  //check if user already exists :Username and email
  const existError = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existError) {
    throw new ApiError(409, "user with email or username is already exist");
  }
  // console.log(req.files);
  //check for image and check for avtar
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // upload them in cloudinary ,avtar
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  // console.log(avatar);
  if (!avatar) {
    throw new ApiError(400, "avatar file is required");
  }

  //  create user object  - create entry in db
  const user = await User.create({
    fullName,
    email,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    password,
    username: username.toLowerCase(),
  });
  //check for user creation
  //remvove password and refresh token field  from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  console.log(createdUser);
  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registring the user");
  }
  // return response
  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "user is registered sucessfully"));
});
const loginUser = asyncHandler(async (req, res) => {
  // data bring req body
  //email and password
  // find the user in database
  //password check
  //access and refresh token
  //send cookie

  //data from req body
  const { username, email, password } = req.body;
  console.log(email);
  if (!(username || email)) {
    throw new ApiError(400, "username or email is required");
  }
  //find user in database
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(400, "username or email is not register yet !!");
  }

  //if user is find in database then check password fromDB
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "password does not match !!");
  }
  //accessToken and refreshToken
  const { accessToken, refreshToken } =
    await generateAccessTokenandRefreshToken(user._id);

  //send cookie
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: accessToken,
          refreshToken,
        },
        "User logged in Successfully !!!!!"
      )
    );
});
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});
const refreshAccessToken = asyncHandler(async (req, res) => {
 const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

 if (!incomingRefreshToken) {
   throw new ApiError(401,"unauthorized request")
 }
 //verify incomingrefreshToken
 try {
  const decodedToken = Jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    //find the user
   const user = await  User.findById(decodedToken?._id)
   if (!user) {
     throw new ApiError(401,"invalid refresh token")
   }
   //matching
 
   if (incomingRefreshToken !== user?.refreshToken) {
     throw new ApiError(401,"refresh token is expired")
   }
    // if both match generate new refresh token
 
    const options={
     httpOnly :true,
     secure :true
    }
   const {accessToken,newRefreshToken}=await generateAccessTokenandRefreshToken(user._id)
   return res.status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",newRefreshToken,options)
   .json(
     new  ApiResponse(
       200,
       {accessToken,refreshToken:newRefreshToken},
       "access token refreshed"
     )
   )
 } catch (error) {
   throw new ApiError(401,error?.message ||'invalid refresh token')
 }


});
const changeCurrentPassword =asyncHandler(async(req,res)=>{
  const {oldPassword ,newPassword}=req.body


  const user = await User.findById(req.user?._id)
 const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
 if (!isPasswordCorrect) {
  throw new ApiError(400,"invalid password")
 }
 user.password = newPassword
 await user.save({validateBeforeSave :false})

 return res.status(200)
 .json(new ApiResponse(200,{},"password change sucessfully"))
})
const getCurrentUser = asyncHandler (async(req,res)=>{
  return res.status(200)
  .json(200, req.user ,"current user fetched sucessfully")
})
const updateAccountDetails = asyncHandler(async(req,res)=>{
const {fullName ,email} = req.body
if (!fullName || !email) {
   throw new ApiError(400,"all field are required")
}
const user = User.findByIdAndUpdate(
  req?.user._id,
  {
 $set :{
  fullName,
  email
 }
  },
  {new:true}
  ).select("-password")
  return res.status(200)
  .json(new ApiResponse(200, "Account details updated sucessfully"))
})
const updateUserAvatar  = asyncHandler(async(req,res)=>{

  const avatarLocalPath = req.file?.path
  if (!avatarLocalPath) {
    throw new ApiError(400,"avatar file is missing")
  }
 const avatar = await uploadOnCloudinary(avatarLocalPath)
 if (!avatar.url) {
  throw new ApiError(400,"error while uploading on avatar")
 }
 const user =await User.findByIdAndDelete(
  req.user?._id,
  {
    $set:{avatar:avatar.url}
  },
  {
    new:true
  }
 ).select( "-password")
return res.status(200)
.json(
  new ApiResponse(200,"avatar is updated sucessfully!!!")
)
})
const updateCoverImage = asyncHandler(async( req,res)=>
{
const coverImageLocalPath =   req.file?.path
if (!coverImageLocalPath) {
  throw new ApiError(400,"coverImgae file is missing")
}
const coverImage = await uploadOnCloudinary(coverImageLocalPath)
if (!coverImage.url) {
  throw new ApiError(400,'Error while uploading the coverImage')
  
}
const user = User.findByIdAndUpdate(
  req.user?._id,
  {
    $set:{coverImage:coverImage.url }
  },
  {
    new :true
  }
).select("-password")
return res.status(200)
.json(
  new ApiResponse(200,"coverImage is updated sucessfully !!!")
)
})

export { registerUser, loginUser, 
  logoutUser ,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,updateAccountDetails ,
  updateUserAvatar,updateCoverImage};
