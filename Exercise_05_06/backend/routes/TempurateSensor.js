// routes/tempurateRoutes.js
import express from "express";
import { AddTempurateSensorValue, getAllDataT, getHumidityTemperature } from "../controller/TempurateController.js";

const router = express.Router();

router.get("/humidityandTemperatures/:board_id", getHumidityTemperature);
router.post("/addTempurateSenSorValue", AddTempurateSensorValue);
router.get("/allDataT", getAllDataT); 


export default router;
