import AutoIncrementFactory from "mongoose-sequence";
import mongoose from "mongoose";

const { Schema } = mongoose;

const TemperatureSensor = new Schema({
  _id: Number,
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  board_id: { type: Number, ref: "Board", required: true },
});

const AutoIncrement = AutoIncrementFactory(mongoose);

TemperatureSensor.plugin(AutoIncrement, {
  id: "sensor_tempurate_seq",
  inc_field: "_id",
  disableIdGenerator: true,
});

export default mongoose.model("TemperatureSensor", TemperatureSensor);
