import express from "express";
import { registerUser, loginUser, forgotPassword, verifyOTPAndResetPassword } from "../controllers/userControllers.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/forget", forgotPassword);
userRouter.post("/reset", verifyOTPAndResetPassword);

export default userRouter;
