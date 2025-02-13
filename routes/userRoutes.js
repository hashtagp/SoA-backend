import express from "express";
import { registerUser, loginUser, forgotPassword, verifyOTPAndResetPassword } from "../controllers/userController.js";

const userRouter = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forget", forgotPassword);
router.post("/reset", verifyOTPAndResetPassword);

module.exports = userRouter;
