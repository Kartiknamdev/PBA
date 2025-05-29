import mongoose, { isValidObjectId } from "mongoose";
import { Task } from "../models/task.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utility/ApiError.js";
import { ApiResponse } from "../utility/ApiResponse.js";
import { asyncHandler } from "../utility/asynchHandler.js";
import { uploadOnCloudinary } from "../utility/cloudinary.js";
import fs from "fs";
import validator from "validator";
import { sanitizeUser } from "../utility/sanitizeuser.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  if (
    [fullName, email, password].some((field) => !field || field.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ $or: [{ fullName }, { email }] });

  if (existedUser) {
    throw new ApiError(409, "User with provided credentials already exists!");
  }

  const user = await User.create({ fullName, email, password });

  const createdUser = await User.findById(user._id);
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        sanitizeUser(createdUser),
        "User registered successfully"
      )
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "Specified user does not exist!");
  }

  if (!password) {
    throw new ApiError(409, "Password is required");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

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
        { user: sanitizeUser(user), accessToken },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", "", { ...options, maxAge: 0 })
    .cookie("refreshToken", "", { ...options, maxAge: 0 })
    .json(new ApiResponse(200, null, "User logged out successfully!"));
});

const updateDetails = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    phone,
    age,
    gender,
    Bio,
    organization,
    skills,
    rating,
  } = req.body;

  const currentUser = await User.findById(req.user?._id);
  if (!currentUser) {
    throw new ApiError(404, "User not found");
  }

  if (email && !validator.isEmail(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  if (phone && !/^\+91\d{10}$/.test(phone)) {
    throw new ApiError(400, "Invalid phone number format");
  }

  let photoUrl = currentUser.photo;
  if (req.file) {
    console.log(req.file)
    try {
      const result = await uploadOnCloudinary(req.file.buffer);
      photoUrl = result;
    } catch (error) {
      throw new ApiError(500, "Photo upload failed");
    }
  }

  const allowedFields = {
    fullName,
    email,
    phone,
    age,
    gender,
    Bio,
    organization,
    skills,
    rating,
    photo: photoUrl,
  };

  const updatedFields = {};
  for (const [key, value] of Object.entries(allowedFields)) {
    if (value !== undefined) {
      updatedFields[key] = value;
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updatedFields },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    throw new ApiError(500, "Failed to update user details");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: sanitizeUser(updatedUser) },
        "User details updated successfully"
      )
    );
});

export { registerUser, loginUser, logoutUser, updateDetails };
