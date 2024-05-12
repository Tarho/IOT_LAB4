import express from "express";
import { AddLightSensorValue, GetLightValue, getAllDataL } from "../controller/LightSensorController.js";

const router = express.Router();

router.get("/lightvalues/:board_id", GetLightValue);
router.post("/addLightSenSorValue", AddLightSensorValue);
router.get("/getAllDataL", getAllDataL); 

export default router;
