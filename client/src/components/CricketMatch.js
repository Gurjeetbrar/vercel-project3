import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import GoogleMapsIcon from "./../img/google-maps.png";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { display, fontSize, margin } from "@mui/system";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import "./../styles/cricketMatch.css";
const CricketMatch = () => {
  const [matches, setMatches] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const backendUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:5000'; 
  useEffect(() => {
    fetchMatches();
  }, []);
  const today = new Date(); // Get today's date

  const fetchMatches = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/api/allmatches/fetchallmatches`
      );
      const data = await response.json();
      setMatches(data);
    } catch (error) {
      console.error(error);
    }
  };
  
  console.log(backendUrl)

  const handleViewTeamClick = (matchId) => {
    const state = { matchId: matchId };
    // console.log("Clicked on View Team with ID:", teamId);
    navigate("/team", { state });
  };

  const tournamentMatches = matches.filter(
    (match) => match.type === "Tournament"
  );
  const funMatches = matches.filter((match) => match.type === "Fun Match");

  const slideLeft = () => {
    var slider = document.querySelector(".tournament");
    slider.scrollLeft = slider.scrollLeft - 500;
  };

  const slideRight = () => {
    var slider = document.querySelector(".tournament");
    slider.scrollLeft = slider.scrollLeft + 500;
  };
  const slideLeftFun = () => {
    var slider = document.querySelector(".funMatch");
    slider.scrollLeft = slider.scrollLeft - 500;
  };

  const slideRightFun = () => {
    var slider = document.querySelector(".funMatch");
    slider.scrollLeft = slider.scrollLeft + 500;
  };
  const styles = {
    customCardStyle: {
      maxWidth: isSmallScreen ? "150px" : "280px",
      maxHeight: isSmallScreen ? "300px" : "400",
      margin: "10px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      transition: "transform 0.3s",
      flex: "0 0 auto",
      borderRadius: "10px",
      
    },
    cardInfo: {
      fontSize: isSmallScreen ? ".6rem" : "1rem",
    },
    cardInfoHeading:{

    }
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h2 className="match-heading">
          Tournament- Bring your team to enroll!
        </h2>
      </div>
      <div className="relative flex items-center">
        <MdChevronLeft
          onClick={slideLeft}
          size={40}
          className="opacity-70 hover:opacity-100 cursor-pointer"
          style={{ color: "white" }}
        />
        <div className="w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide tournament ">
          <div style={{ marginRight: "50px" }}>
            {tournamentMatches.map((match, index) => {
              const matchDate = new Date(match.date);

              if (matchDate >= today) {
                return (
                  <div
                    key={index}
                    className="sm:w-[300px] inline-block p-2 cursor-pointer hover:scale-105 ease-in-out duration-300 "
                  >
                    <div onClick={() => handleViewTeamClick(match._id)}>
                      <Card
                        sx={styles.customCardStyle}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.05)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      >
                        <CardActionArea>
                          <CardMedia
                            component="img"
                            height="200"
                            image="cricket.jpg"
                            alt="Match"
                            style={{
                              padding: isSmallScreen
                                ? "8px 8px 0 8px "
                                : "10px",
                            }}
                          />
                          <CardContent>
                            <Typography component="body1" styles={styles.cardInfoHeading}>
                              <div
                                style={{
                                  maxWidth: "100%",
                                  whiteSpace: "normal",
                                  fontSize: isSmallScreen? `${Math.min(
                                    1.5,
                                    3.8 - match.location.length * 0.1
                                  )}vh`:`${Math.min(
                                    4,
                                    5.7 - match.location.length * 0.1
                                  )}vh`,
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  margin: "0",
                                  paddingBottom: isSmallScreen ? "6px" : "15px",
                                  fontWeight: "medium",
                                }}
                              >
                                {match.location}
                              </div>
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={styles.cardInfo}
                            >
                              Type: {match.type} <br />
                              Time: {match.time} <br />
                              Day: {match.date} <br />
                              <div className="linkContainer">
                                <a
                                  href={match.address}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mapLink"
                                  onClick={(event) => event.stopPropagation()}
                                >
                                  Open in Maps
                                  <span className="iconContainer">
                                    <img
                                      src={GoogleMapsIcon}
                                      alt="Google Maps"
                                      className="mapIcon"
                                    />
                                  </span>
                                </a>
                              </div>
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
        <MdChevronRight
          onClick={slideRight}
          size={40}
          className="opacity-70 hover:opacity-100 cursor-pointer"
          style={{ color: "white" }}
        />
      </div>
      <div style={{ marginTop: "5%" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h2 className="match-heading">
            Fun Match- Enroll yourself to available teams!
          </h2>
        </div>
        <div className="relative flex items-center">
          <MdChevronLeft
            onClick={slideLeftFun}
            size={40}
            className="opacity-70 hover:opacity-100 cursor-pointer"
            style={{ color: "white" }}
          />
          <div className="w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide funMatch">
            <div style={{ marginRight: "50px" }}>
              {funMatches.map((match, index) => {
                const matchDate = new Date(match.date);

                if (matchDate >= today) {
                  return (
                    <div
                      key={index}
                      className="sm:w-[300px] inline-block p-2 cursor-pointer hover:scale-105 ease-in-out duration-300"
                    >
                      <Link
                        to="/team"
                        state={{ matchId: match._id }}
                        style={{ textDecoration: "none" }}
                      >
                        <Card
                          sx={styles.customCardStyle}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.05)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                          }}
                        >
                          <CardActionArea>
                            <CardMedia
                              component="img"
                              height="200"
                              image="cricket.jpg"
                              alt="Match"
                              style={{
                                padding: isSmallScreen
                                  ? "8px 8px 0 8px "
                                  : "10px",
                              }}
                            />
                            <CardContent>
                            <Typography component="body1" styles={styles.cardInfo}>
                              <div
                                style={{
                                  maxWidth: "100%",
                                  whiteSpace: "normal",
                                  fontSize: isSmallScreen? `${Math.min(
                                    1.5,
                                    3.8 - match.location.length * 0.1
                                  )}vh`:`${Math.min(
                                    4,
                                    5.7 - match.location.length * 0.1
                                  )}vh`,
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  margin: "0",
                                  paddingBottom: isSmallScreen ? "6px" : "15px",
                                  fontWeight: "medium",
                                }}
                              >
                                {match.location}
                              </div>
                            </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={styles.cardInfo}
                              >
                                Type: {match.type} <br />
                                Time: {match.time} <br />
                                Day: {match.date} <br />
                                <div className="linkContainer">
                                  <a
                                    href={match.address}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mapLink"
                                    onClick={(event) => event.stopPropagation()}
                                  >
                                    Open in Maps
                                    <span className="iconContainer">
                                      <img
                                        src={GoogleMapsIcon}
                                        alt="Google Maps"
                                        className="mapIcon"
                                      />
                                    </span>
                                  </a>
                                </div>
                              </Typography>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Link>
                    </div>
                  );
                }
              })}
            </div>
          </div>
          <MdChevronRight
            onClick={slideRightFun}
            size={40}
            className="opacity-70 hover:opacity-100 cursor-pointer"
            style={{ color: "white" }}
          />
        </div>
      </div>
      ;
    </>
  );
};

export default CricketMatch;
