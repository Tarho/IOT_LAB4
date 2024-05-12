import LightSensor from "../models/sensor_light.js";
import Board from "../models/board.js";

// Update endpoint to fetch LED status based on board ID
export const GetLightValue = async (req, res, next) => {
  try {
    const board_id = req.params.board_id;
    // Fetch light values specific to the board ID
    const latestLightValue = await LightSensor.findOne({ board_id: board_id })
      .sort({ _id: -1 }) // Sort by _id field in descending order
      .limit(1); // Retrieve the latest light value

    if (!latestLightValue) {
      return res.status(404).json({ message: "Light value not found" });
    }

    return res.status(200).json(latestLightValue.light);
  } catch (error) {
    console.error("Error fetching light value:", error); // Log the error for debugging
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Endpoint to fetch board data
export const getAllBoards = async (req, res, next) => {
  try {
    const boards = await Board.find();
    return res.status(200).json(boards);
  } catch (error) {
    console.error("Error fetching board data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// POST
export const AddLightSensorValue = async (req, res, next) => {
  try {
    const board_id = req.params.board_id;
    const { light } = req.body;

    // Find the board by name
    const board = await Board.findOne({ board_id });

    if (!board) {
      return res.status(404).json({ success: false, error: "Board not found" });
    }

    // Create a new light sensor instance with the board_id
    const lightsensor = new LightSensor({
      board_id: board._id,
      light,
    });

    // Save the lightsensor
    await lightsensor.save();

    return res.status(200).json({ success: true, sensor: lightsensor });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

export const getAllDataL = async (req, res, next) => {
  try {
    const allData = await LightSensor.find();
    return res.status(200).json(allData);
  } catch (error) {
    console.error("Error fetching all data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};