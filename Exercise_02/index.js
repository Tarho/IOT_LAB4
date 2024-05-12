const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 8080;

app.use(bodyParser.json());

let sensorData = null;

app.post("/api/lightconbuom", (req, res) => {
  const lightOn = req.body.light;
  const temperature = req.body.temperature;

  sensorData = {
    light: lightOn,
    temperature: temperature,
  };

  const response = {
    error: false,
    message: "Data received successfully",
    data: sensorData,
  };
  return res.status(200).json(response);
});

app.get("/api/sensordata", (req, res) => {
  if (sensorData) {
    return res.status(200).json(sensorData);
  } else {
    return res
      .status(404)
      .json({ error: true, message: "Sensor data not found" });
  }
});

app.put("/api/updatesensordata", (req, res) => {
  if (!sensorData) {
    return res
      .status(404)
      .json({ error: true, message: "Sensor data not found" });
  }

  const light = req.body.light;
  const temperature = req.body.temperature;

  // Assuming you want to update only if new values are provided
  const updatedLight = light !== undefined ? light : sensorData.light;
  const updatedTemperature =
    temperature !== undefined ? temperature : sensorData.temperature;

  sensorData = {
    light: updatedLight,
    temperature: updatedTemperature,
  };

  const response = {
    data: sensorData,
  };
  return res.status(200).json(response);
});

app.delete("/api/deletesensordata", (req, res) => {
  if (!sensorData) {
    return res
      .status(404)
      .json({ error: true, message: "Sensor data not found" });
  }
  sensorData = null;
  return res.status(200).json("Delete successful");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
