import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import {uploadOnCloudinary} from '../utils/CloudinaryFileUpload.js'
import { ApiResponse } from "../utils/ApiResponse.js";

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
  const { fullName, username, email, password } = req.body
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
  const avatarLocalPath = req.files?.avatar?.[0]?.path
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // upload them in cloudinary ,avtar
  const avatar =await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)
  // console.log(avatar);
  if (!avatar) {
    throw new ApiError(400,'avatar file is required')
    
  }

    //  create user object  - create entry in db
  const user = await User.create({
    fullName,
    email,
    avatar :avatar.url,
    coverImage :coverImage?.url ||'',
    password,
    username : username.toLowerCase()

  })
  //check for user creation
  //remvove password and refresh token field  from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
)
   console.log(createdUser);
    if (!createdUser) {
        throw new ApiError(500,'something went wrong while registring the user')
    }
  // return response
  return  res.status(200).json(
    new ApiResponse(200,createdUser,'user is registered sucessfully')
  )
  
  
});

export { registerUser };
