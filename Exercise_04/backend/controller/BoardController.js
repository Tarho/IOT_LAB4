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

export const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const { status, date } = req.body; // Extract status and date from the request body

    // Find the board by ID and update its status and date
    const updatedBoard = await Board.findByIdAndUpdate(
      id, // ID of the board to update
      { status, date }, // Data to update
      { new: true } // Return the updated document
    );

    // Check if a board was found and updated
    if (!updatedBoard) {
      return res.status(404).json({ success: false, error: "Board not found" });
    }

    // Send the updated board as response
    return res.status(200).json(updatedBoard);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

export const monitorStatus = async (req, res, next) => {
  try {
    // Find all boards with status 1 that haven't been updated in the last 10 seconds
    const outdatedBoards = await Board.find({
      status: 1,
      date: { $lt: new Date(Date.now() - 10000) },
    });

    // Update status to 0 for outdated boards
    outdatedBoards.forEach(async (board) => {
      board.status = 0;
      await board.save();
    });

    console.log("Status monitoring completed.");
  } catch (error) {
    console.error("Error monitoring status:", error);
  }
};
setInterval(monitorStatus, 10000); // Run every 10 seconds
