import AutoIncrementFactory from "mongoose-sequence";
import mongoose from "mongoose";

const { Schema } = mongoose;

const Board = new Schema({
  _id: Number,
  board_name: { type: String, required: true },
  board_type: { type: String, required: true },
  status: { type: Number, required: true },
  date: { type: Date, required: true },
});

const AutoIncrement = AutoIncrementFactory(mongoose);

Board.plugin(AutoIncrement, {
  id: "board_seq",
  inc_field: "_id",
  disableIdGenerator: true, // Disable Mongoose's default ObjectId generator
});

export default mongoose.model("Board", Board);
