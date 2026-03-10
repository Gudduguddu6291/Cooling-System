import express from "express";
import { sendToML } from "../controllers/sendToMLController.js";

const router = express.Router();

router.post("/", sendToML);

export default router;