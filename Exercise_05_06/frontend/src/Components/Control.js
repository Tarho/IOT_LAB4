import React, { useState, useEffect } from "react";
import { sendMessage } from "./mqttService";
import SensorChart from "./SensorChart"; // Assuming SensorChart is the name of the chart component file
import SensorChart1 from "./SensorChart1"; // Assuming SensorChart is the name of the chart component file
import SensorChart2 from "./SensorChart2"; // Assuming SensorChart is the name of the chart component file

function ToggleButton({ topic, initialStatus }) {
  const [isOn, setIsOn] = useState(initialStatus);

  const handleClick = () => {
    const newStatus = !isOn;
    setIsOn(newStatus);
    const message = { out: newStatus ? 1 : 0 };
    sendMessage(topic, JSON.stringify(message));
  };

  return (
    <button
      className={`toggle-button ${isOn ? "on" : "off"}`}
      onClick={handleClick}
    >
      {isOn ? "Turn Off" : "Turn On"}
    </button>
  );
}

const Control = () => {
  const [light, setLightValue] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [temperature, setTemperature] = useState(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 6000); // Auto-refresh every 5 seconds
    return () => clearInterval(interval); // Clean up the interval on unmount
  }, []);

  const fetchData = () => {
    // Fetch data for each LED
    fetch(`http://localhost:8080/api/lightvalues/1`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Light sensor data:", data);
        setLightValue(data);
      })
      .catch((error) => {
        console.error("Error fetching light sensor value:", error);
      });

    fetch(`http://localhost:8080/api/humidityandTemperatures/2`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Humidity and Temperature data:", data);
        setHumidity(data.humidity);
        setTemperature(data.temperature);
      })
      .catch((error) => {
        console.error("Error fetching humidity and temperature data:", error);
      });
    // Fetch data for other LEDs similarly
  };

  return (
    <div className="home-banner-container1">
      <div className="home-text-section">
        <h1 className="primary-heading1">LEDs Control Status</h1>
        <div className="container1">
          <h2>Wemos 1</h2>
          <p className="primary-text1">
            Led 1{" "}
            <ToggleButton topic={`esp8266/client1`} initialStatus={false} />
          </p>

          <div className="container">
            <p className="primary-text1">
              Led 2{" "}
              <ToggleButton topic={`esp8266/client2`} initialStatus={false} />
            </p>
          </div>
          <div className="container1">
            <h2>Wemos 2</h2>
            <p className="primary-text1">
              Led 3{" "}
              <ToggleButton topic={`esp8266/client3`} initialStatus={false} />
            </p>
          </div>
          <div className="container">
            <p className="primary-text1">
              Led 4{" "}
              <ToggleButton topic={`esp8266/client4`} initialStatus={false} />
            </p>
          </div>
        </div>
      </div>
      <div className="home-text-section1">
        <h1 className="primary-heading1">Sensor Status</h1>
        <div className="container">
          <p className="primary-text1">
            Temperature Room:{" "}
            {temperature !== null ? temperature : "Loading..."}
          </p>
        </div>
        <div className="container2">
          <SensorChart />
        </div>
        <div className="container">
          <p className="primary-text1">
            Humidity Room: {humidity !== null ? humidity : "Loading..."}
          </p>
        </div>
        <div className="container2">
          <SensorChart1 />
        </div>
        <div className="container">
          <p className="primary-text1">
            Light Room: {light !== null ? light : "Loading..."}
          </p>
        </div>
        <div className="container2">
          <SensorChart2 />
        </div>
      </div>
    </div>
  );
};

export default Control;
