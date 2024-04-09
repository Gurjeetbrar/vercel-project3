import React from "react";
import Alert from '@mui/material/Alert';
import CricketMatch from "./CricketMatch";
import cricketCollage from "./../img/cricketPlayer3.png";
import background from "./../img/cricketProject3.jpg";
import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./../styles/home.css"
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useState,useEffect } from "react";
const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [loginAlert, setloginAlert] = useState(null)
  useEffect(() => {
    setloginAlert(localStorage.getItem('loginAlert'))
  }, []);
  useEffect(() => {
    if (loginAlert) {
      

      // Hide the success alert after five seconds
      const timer = setTimeout(() => {
        alertSuccess()
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [loginAlert]);

  const alertSuccess = () => {
    setloginAlert(null);
    localStorage.removeItem('loginAlert');
  };

  const handleClick = () => {
    const matchesSection = document.getElementById("matches");
    matchesSection.scrollIntoView({ behavior: "smooth" });
  };

  return (<>
  <div className="center-container">
  {
        loginAlert && (
          <Alert severity="success" className="general-alert">
            {loginAlert}
          </Alert>
        )}
  </div>
  
  
    <div className="containerStyles">
     
      <div className="contentContainer" style={{ backgroundImage: `url(${background})` }}>
        <p className="heading">Explore Tournament and Fun Matches to Find Teammates.</p>
        <div className="buttonContainer">
      <Button
        variant="contained"
        style={{
          background: "none",
          border: "1px solid",
          backgroundColor: "red",
          borderColor: "currentColor",
          color: "white",
          fontWeight: "bold",
          fontSize: isSmallScreen? '10px':'15px',
          padding: isSmallScreen ? "5px 10px" : "10px 20px",
        }}
        onClick={handleClick}
      >
        Get Started
      </Button>
    </div>
      </div>

      <div className="membershipContainer" style={{ backgroundImage: `url(${cricketCollage})` }}>
        <div className="membershipTextContainer">
          <h1 className = "membershipHeading" style={{ color: "#F8FAF9", fontWeight: "700" }}>
            Memberships as low as{" "}
            <div style={{ color: "#F4A004", display: "inline" }}>$14.99</div>
            /month
          </h1>
          <p className="membershipDescription">
            Unlock way into any Tournament or Fun Match without paying any
            match fees and more.
          </p>
        </div>
        <div className="membershipButtonContainer">
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/mymembership")}
            style={{
              borderRadius: "20px",
              backgroundColor: "#F4A004",
              color: "black",
              fontWeight: "bold",
              fontSize: isSmallScreen? '10px':'15px',
              padding: isSmallScreen ? "3px 10px" : ".4rem 2rem",
            }}
          >
            Become Member
          </Button>
        </div>
      </div>

      <div className="matchesContainer" id="matches">
        <CricketMatch />
      </div>
    </div>
    </>
  );
};

export default Home;



