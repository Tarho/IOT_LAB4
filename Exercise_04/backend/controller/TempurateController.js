// controller/TempurateController.js
import TemperatureSensor from "../models/sensor_tempurate.js";
import Board from "../models/board.js";

export const getHumidityTemperature = async (req, res, next) => {
  try {
    const board_id = req.params.board_id;
    // Fetch humidity and temperature values specific to the board ID
    const latestHumidityTemperatureValue = await TemperatureSensor.findOne({
      board_id: board_id,
    })
      .sort({ _id: -1 })
      .limit(1);

    if (!latestHumidityTemperatureValue) {
      return res
        .status(404)
        .json({ message: "Humidity and temperature value not found" });
    }

    const response = {
      humidity: latestHumidityTemperatureValue.humidity,
      temperature: latestHumidityTemperatureValue.temperature,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching humidity and temperature value:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const AddTempurateSensorValue = async (req, res, next) => {
  try {
    const { temperature, humidity, board_id } = req.body;
    const board = await Board.findOne({ _id: board_id });

    if (!board) {
      return res.status(404).json({ success: false, error: "Board not found" });
    }

    // Create a new temperature sensor instance
    const temperaturesensor = new TemperatureSensor({
      temperature,
      humidity,
      board_id,
    });

    // Save the temperature sensor data
    await temperaturesensor.save();

    return res.status(200).json({ success: true, sensor: temperaturesensor });
  } catch (error) {
    console.error("Error adding temperature and humidity sensor value:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};
