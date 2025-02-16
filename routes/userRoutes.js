import express from "express";
import { registerUser, loginUser, forgotPassword, verifyOTPAndResetPassword } from "../controllers/userControllers.js";
import authMiddleware from "../middlewares/authmiddleware.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/forget", forgotPassword);
userRouter.post("/reset", verifyOTPAndResetPassword);
userRouter.get("/verify",authMiddleware);

export default userRouter;
