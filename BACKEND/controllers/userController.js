// Import required dependencies and utilities
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";

// Controller for user registration
export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, phone, password, role } = req.body;
  
  // Validate required fields
  if (!name || !email || !phone || !password || !role) {
    return next(new ErrorHandler("Please fill full form!"));
  }

  // Check if email already exists
  const isEmail = await User.findOne({ email });
  if (isEmail) {
    return next(new ErrorHandler("Email already registered!"));
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role,
  });

  // Send success response with token
  sendToken(user, 201, res, "User Registered!");
});

// Controller for user login
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;

  // Validate required fields
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please provide email ,password and role."));
  }

  // Find user and include password field
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }

  // Verify password
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }

  // Verify user role
  if (user.role !== role) {
    return next(
      new ErrorHandler(`User with provided email and ${role} not found!`, 404)
    );
  }

  // Send success response with token
  sendToken(user, 201, res, "User Logged In!");
});

// Controller for user logout
export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .json({
      success: true,
      message: "Logged Out Successfully.",
    });
});

// Controller to get user profile
export const getUser = catchAsyncErrors((req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});