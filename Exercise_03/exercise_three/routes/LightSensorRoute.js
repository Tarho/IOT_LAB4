import express from "express";
const router = express.Router();
import {
  AddLightSensorValue,
  GetLightValue,
} from "../controller/LightSensorController.js";

router.get("/lightvalues/:board_id", GetLightValue);
router.post("/addLightSenSorValue", AddLightSensorValue);

export default router;
