import React, { useEffect, useState } from "react";
import BannerBackground from "../Assets/home-banner-background (1).png";
import BannerImage from "../Assets/illustration of a man working.png";
import { Link } from "react-router-dom";
import wemos from "../Assets/wemos_d1_r2.png";

const Home = () => {
  const [boardsData, setBoardsData] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      fetch("http://localhost:8080/api/boards")
        .then(response => response.json())
        .then(data => setBoardsData(data))
        .catch(error => console.error("Error fetching boards data:", error));
    };

    fetchData(); // Initial fetch

    const intervalId = setInterval(fetchData, 6000); // Fetch data every 6 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  const getDateColor = status => {
    return status === 0 ? "red" : "green";
  };

  return (
    <div className="home-container">
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img src={BannerBackground} alt="" />
        </div>
        <div className="home-text-section">
          <h1 className="primary-heading">Hi, My Customer</h1>
          <p className="primary-text">Nguyen Thi Ngoc Thao - 20521935</p>
          <p className="primary-text">Nguyen Ngoc Huyen - 20521423</p>
          <p className="primary-text">Pham Ha Minh Quyen - 20521824</p>
          <Link to="/Control" className="secondary-button">
            View led status
          </Link>
        </div>
        <div className="home-image-section">
          <img src={BannerImage} alt="" />
        </div>
      </div>
      <div className="home-banner-container">
        <div className="home-text-section">
          <h1 className="primary-heading1">Devices Control Status</h1>
          {boardsData.map(board => (
            <div className="container" key={board._id}>
              <p className="primary-text1">
                {board._id === 1 ? "Wemos 1" : "Wemos 2"}
                <img className="img1" src={wemos} alt="" />
                <span className="date" style={{ color: getDateColor(board.status) }}>{board.date}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
