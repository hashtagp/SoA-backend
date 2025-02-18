import express from "express";
import { startTest, saveTest, getTestResult, fetchTest, retryTest  } from "../controllers/testControllers.js";
import authMiddleware from "../middlewares/authmiddleware.js";

const testRouter = express.Router();

testRouter.get("/start", authMiddleware, startTest);
testRouter.post("/save", authMiddleware, saveTest);
testRouter.get("/result", authMiddleware, getTestResult);
testRouter.get("/fetch", authMiddleware, fetchTest);
testRouter.patch("/retry", authMiddleware, retryTest);

export default testRouter;
