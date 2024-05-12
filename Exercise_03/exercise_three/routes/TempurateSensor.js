// routes/tempurateRoutes.js
import express from "express";
const router = express.Router();
import {
  AddTempurateSensorValue,
  getHumidityTemperature,
} from "../controller/TempurateController.js";

router.get("/humidityandTemperatures/:board_id", getHumidityTemperature);
router.post("/addTempurateSenSorValue", AddTempurateSensorValue);

export default router;
