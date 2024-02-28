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
  const { fullName, username, email, password } = req.body;
  console.log(" your email :", email);

  //validation -not empty
  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "all field is required");
  }
    //check if user already exists :Username and email
  const existError = User.findOne({
    $or: [{ username }, { email }],
  });
  if (existError) {
    throw new ApiError(409, "user with email or username is already exist");
  }

  //check for image and check for avtar
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avtar file is required");
  }

  // upload them in cloudinary ,avtar
   const avatar =await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if (!avatar) {
    throw new ApiError(400,'avtar file is required')
    
  }

    //  create user object  - create entry in db
  const user = await User.create({
    fullName,
    avatar :avatar.url,
    coverImage :coverImage?.url ||'',
    email,
    password,
    username : username.toLowerCase()

  })
  //check for user creation
  //remvove password and refresh token field  from response
   const createUser = await user.findById(user.field_id).select(
    "-password -refreshToken"
   )
    if (!createUser) {
        throw new ApiError(500,'something went wrong while registring the user')
    }
  // return response
  return  res.status(200).json(
    new ApiResponse(200,createUser,'user is registered sucessfully')
  )
  
});

export { registerUser };
