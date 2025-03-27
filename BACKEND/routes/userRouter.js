// Import required dependencies and controllers
import express from "express";
import { login, register, logout, getUser } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Define user authentication routes
router.post("/register", register);  // Route for user registration
router.post("/login", login);        // Route for user login
router.get("/logout", logout);       // Route for user logout
router.get("/getuser", isAuthenticated, getUser);  // Route to get user profile (protected)

export default router;
