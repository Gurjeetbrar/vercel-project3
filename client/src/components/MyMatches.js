import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Typography, Card, CardContent, Button } from "@mui/material";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
const MyMatches = () => {
  const navigate = useNavigate();
  const [matchIds, setMatchIds] = useState([]);
  const [matches, setMatches] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const today = new Date(); // Get today's date
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const backendUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:5000'; 
  const areAnyMatchesPlayed = matches.some((match) => {
    const matchDate = new Date(match.match.date);
    return matchDate < today;
  });
  const handleClick = () => {
    navigate("/");
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (matchIds.length > 0) {
      fetchMatches();
    }
  }, [matchIds]);

  const token = localStorage.getItem("token");

  const fetchUser = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/api/matches/fetchallmatches`,
        {
          method: "GET",
          headers: {
            "auth-token": token,
          },
        }
      );
      const data = await response.json();
      const ids = data.map((match) => match.id);
      setMatchIds(ids);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMatches = async () => {
    try {
      const promises = matchIds.map((id) =>
        fetch(`${backendUrl}/api/allmatches/getmatches`, {
          method: "GET",
          headers: {
            "match-Id": id,
          },
        }).then((response) => response.json())
      );
      const matchData = await Promise.all(promises);
      setMatches(matchData);
    } catch (error) {
      console.log(error);
    }
  };

  const slideLeft = () => {
    var slider = document.querySelector(".tournament");
    slider.scrollLeft = slider.scrollLeft - 500;
  };

  const slideRight = () => {
    var slider = document.querySelector(".tournament");
    slider.scrollLeft = slider.scrollLeft + 500;
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };
  const styles = {
    cardStyles: {
      display: "inline-block",
      margin: "10px",
      padding:isSmallScreen?".5rem": ".7rem",
      maxWidth: isSmallScreen?"10rem": "20rem",
      backgroundColor: "#f5f5f5",
      borderRadius: "5px",
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
    },
  
    imageStyles: {
      width: "100%",
      height: isSmallScreen?"100px":"200px",
      objectFit: "cover",
    },
  
    titleStyles: {
      fontSize: isSmallScreen ? ".8rem" : "1.2rem",
      fontWeight: "bold",
      margin: "10px 0",
      
    },
  
    descriptionStyles: {
      fontSize: isSmallScreen ? ".6rem" : "1rem",
      margin: "0",
    },
  
    buttonStyles: {
      backgroundColor: "#088A08",
      color: "#fff",
      padding: "8px 16px",
      borderRadius: "5px",
      border: "none",
      cursor: "pointer",
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
      marginTop: "5px",
    },
    headingStyle: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginTop: "2rem",
      color: "#196613",
    },
  };

  

  return (
    <>
      <div
        style={{
          backgroundColor: "#AAD6F0",
          padding: isSmallScreen?"1.5rem 0": "3.5rem 0",
          width: "100%",
          minHeight: "100vh",
          
        }}
      >
        {matches.length === 0 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              paddingTop: isSmallScreen ? "6rem":"10rem",
              paddingBottom: isSmallScreen ? "6rem":"0",
              margin: isSmallScreen ? "2rem 2rem 2rem":"0 10rem",
            }}
          >
            <h2 style={{ color: "#196613",fontSize: isSmallScreen ? "1.2rem" : "2rem",}}>
              No matches found. To explore cricket matches click below!
            </h2>
            <div style={{ display: "block", paddingTop: "1rem" }}>
              <Button
                variant="contained"
                style={{
                  background: "none",
                  border: "1px solid",
                  backgroundColor: "#0073B9  ",
                  borderColor: "currentColor",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: isSmallScreen ? ".5rem":"1rem",
                }}
                onClick={handleClick}
              >
                Get Started
              </Button>
            </div>
          </div>
        ) : (
          matches && (
            <>
              <div style={styles.headingStyle}>
                <h2 style={{fontSize: isSmallScreen ? "1.2rem" : "2rem",}}>Upcoming Matches</h2>
              </div>
              <div className="relative flex items-center">
                <MdChevronLeft
                  onClick={slideLeft}
                  size={40}
                  className="opacity-40 hover:opacity-100 cursor-pointer"
                  style={{ color: "Black" }}
                />
                <div className="w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide tournament">
                  <div style={{ margin: "10px", marginTop: "2rem", }}>
                    {matches.map((match, index) => {
                      const matchDate = new Date(match.match.date);

                      if (matchDate > today) {
                        return (
                          <div key={index} style={styles.cardStyles}>
                            <img
                              src="cricket.jpg"
                              alt="Match"
                              style={styles.imageStyles}
                            />
                            <div style={{
                                  maxWidth: "100%",
                                  whiteSpace: "normal",
                                  fontSize: `${Math.min(
                                    4,
                                    5.7 - match.match.location.length * 0.1
                                  )}vh`,
                                  display: "flex",
                                  justifyContent: "center",
                                  flexDirection:'column',
                                  alignItems: "center",
                                  margin: "0",
                                  paddingBottom: isSmallScreen ? "0px" : "15px",
                                  fontWeight: "medium",
                                }}>
                                  
                              <h5 style={styles.titleStyles}>
                                {match.match.location}
                              </h5>
                              </div>
                              <p style={styles.descriptionStyles}>
                                Type: {match.match.type} <br />
                                Time: {match.match.time} <br />
                                Date: {formatDate(match.match.date)} <br />
                              </p>
                           
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>
                <MdChevronRight
                  onClick={slideRight}
                  size={40}
                  className="opacity-40 hover:opacity-100 cursor-pointer"
                  style={{ color: "Black" }}
                />
              </div>
              {areAnyMatchesPlayed && (<>
              <div style={styles.headingStyle}>
                <h2 style={{fontSize: isSmallScreen ? "1.2rem" : "2rem",}}>Played Matches</h2>
              </div>
              <div className="relative flex items-center">
                <MdChevronLeft
                  onClick={slideLeft}
                  size={40}
                  className="opacity-40 hover:opacity-100 cursor-pointer"
                  style={{ color: "Black" }}
                />
                <div className="w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide tournament">
                  <div style={{ marginRight: "50px", marginTop: "2rem" }}>
                    {matches.map((match, index) => {
                      const matchDate = new Date(match.match.date);

                      if (matchDate < today) {
                        return (
                          <div key={index} style={styles.cardStyles}>
                            <img
                              src="cricket.jpg"
                              alt="Match"
                              style={styles.imageStyles}
                            />
                            <div style={{
                                  maxWidth: "100%",
                                  whiteSpace: "normal",
                                  fontSize: `${Math.min(
                                    4,
                                    5.7 - match.match.location.length * 0.1
                                  )}vh`,
                                  display: "flex",
                                  justifyContent: "center",
                                  flexDirection:'column',
                                  alignItems: "center",
                                  margin: "0",
                                  paddingBottom: isSmallScreen ? "0px" : "15px",
                                  fontWeight: "medium",
                                }}>
                                  
                              <h5 style={styles.titleStyles}>
                                {match.match.location}
                              </h5>
                              </div>
                              <p style={styles.descriptionStyles}>
                                Type: {match.match.type} <br />
                                Time: {match.match.time} <br />
                                Date: {formatDate(match.match.date)} <br />
                              </p>
                           
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>
                
                <MdChevronRight
                  onClick={slideRight}
                  size={40}
                  className="opacity-40 hover:opacity-100 cursor-pointer"
                  style={{ color: "Black" }}
                />
              </div>
              </>)}
            </>
          )
        )}
      </div>
    </>
  );
};



export default MyMatches;
