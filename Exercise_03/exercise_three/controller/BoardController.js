import Board from "../models/board.js";
import moment from "moment-timezone";

//Get
export const GetAllData = async (req, res, next) => {
  try {
    const boards = await Board.find();
    return res.status(200).json(boards);
  } catch (error) {
    console.error(error);
  }
};

export const AddBoardData = async (req, res, next) => {
  try {
    const { board_name, board_type, status, date } = req.body;

    /** board_name: { type: String, required: true },
  board_type: { type: String, required: true },
  status: { type: String, required: true },
  date: { type: Date, required: true }, */

    const board = new Board({
      board_name,
      board_type,
      status,
      date,
    });

    await board.save();

    return res.status(200).json({ success: true, board });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};
