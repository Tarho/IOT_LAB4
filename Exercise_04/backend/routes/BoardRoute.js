import express from "express";
import {
  AddBoardData,
  GetAllData,
  updateStatus,
  monitorStatus,
} from "../controller/BoardController.js";

const router = express.Router();

router.get("/boards", GetAllData);
router.post("/addBoard", AddBoardData);
router.put("/updateStatus/:id", updateStatus);
router.get("/getDate", monitorStatus);

export default router;
