import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors"; // Import cors middleware
import BoardRoute from "./routes/BoardRoute.js";
import LightRoute from "./routes/LightSensorRoute.js";
import TempuratureRoute from "./routes/TempurateSensor.js";

const app = express();
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connect to mongodb");
  } catch (error) {
    console.error("Mongodb connection error:", error);
    process.exit(1);
  }
};

app.use(express.json());

// Use cors middleware
app.use(cors());

app.use("/api", BoardRoute);
app.use("/api", LightRoute);
app.use("/api", TempuratureRoute);

const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
  await connect();
  console.log(`Server is running on port ${PORT}`);
});
