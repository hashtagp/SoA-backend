import express from  "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import connectToDatabase from "./config/dbConfig.js";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import testRouter from "./routes/testRoutes.js";
import authMiddleware from "./middlewares/authmiddleware.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

connectToDatabase();

app.use("/api/users",userRouter);
app.use("/api/admin",adminRouter);
app.use("/api/test",testRouter);

app.get("/",(req,res)=>{
    res.send("Api is running");
})

const PORT = process.env.PORT || 5000;

console.log(`Server is running on port ${PORT}`);

app.listen(PORT);