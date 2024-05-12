import React, { useEffect, useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import 'chart.js/auto'; 


const SensorChart = () => {
  const [sensorData, setSensorData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/allDataT");
      const data = await response.json();
      setSensorData(data);
    } catch (error) {
      console.error("Error fetching sensor data:", error);
    }
  };

  // Extracting temperature and humidity data
  const temperatures = sensorData.map((data) => data.temperature);
  const humidities = sensorData.map((data) => data.humidity);
  const ids = sensorData.map((data) => data._id);

  // Building chart data
  const chartData = {
    labels: ids,
    datasets: [
      {
        label: "Temperatures",
        data: temperatures,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
    ],
  };

  // Chart options
  const chartOptions = {
    scales: {
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Value",
          },
        },
      ],
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Index",
          },
        },
      ],
    },
  };

  return <Line data={chartData} options={chartOptions} />;
};

export default SensorChart;
