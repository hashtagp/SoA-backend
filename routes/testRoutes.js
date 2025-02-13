import express from "express";
import { startTest, saveTest } from "../controllers/testController.js";
import authMiddleware from "../middlewares/Middleware.js";

const testRouter = express.Router();

router.post("/start", authMiddleware, startTest);
router.post("/save", authMiddleware, saveTest);

module.exports = testRouter;
