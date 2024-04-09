import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Alert from '@mui/material/Alert';
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import './../styles/team.css'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Typography,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

const Team = () => {
  let navigate = useNavigate();
  const location = useLocation();
  const state = location.state;
  const [match, setMatch] = useState(null);
  const [matchAlert, setMatchAlert] = useState(null)
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const alertSuccess = () => {
    setMatchAlert(null);
    localStorage.removeItem('matchAlert'); // Remove the item from localStorage
  };
  useEffect(() => {
    fetchMatch();
    setMatchAlert(localStorage.getItem('matchAlert'))
   
  }, []);
  useEffect(() => {
    if (matchAlert) {
      // Hide the success alert after five seconds
      const timer = setTimeout(() => {
        alertSuccess();
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [matchAlert]);
  const countPlayersInTeam = (teamName) => {
    if (!match) return 0;
    const team = match.Teams.find((t) => t.name === teamName);
    return team ? team.team.length : 0;
  };
  const backendUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:5000'; 
  console.log(backendUrl)
  const fetchMatch = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/api/allmatches/getmatches`,
        {
          method: "GET",
          headers: {
            "match-id": state.matchId,
          },
        }
      );
      const data = await response.json();
      setMatch(data.match);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (match.type === "Fun Match") {
      navigate("/joinfunteam", { state });
    } else {
      navigate("/joinmatch", { state });
    }
  };
  const styles = {
    cricketGround: {
      width: "100%",
      marginBottom: "20px",
    },
    
    teamAccordion: {
      marginBottom: "20px",
    },
    teamName: {

      fontSize:isSmallScreen?".8rem": "20px",
      fontWeight: "bold",
      top: 0, 
      position:'sticky'
    },
    playerList: {
      paddingLeft: "20px",
    },
    playerItem: {
      margin: "10px 0",
    },
    playerName: {
      fontWeight: "bold",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "center",
      marginTop: "30px",
    },
    button: {
      padding: isSmallScreen?"8px 15px": "10px 30px",
      fontSize: isSmallScreen? ".6rem": ".8rem"
    },
    container:{
      padding: '10px',
      margin:isSmallScreen?'30% 1.5rem 30% 1.5rem':'6rem'
    }
  };

  const renderTeams = () => {
    if (match.Teams.length === 0) {
      return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Typography variant="h5">
            Currently, there are no teams in this match.
          </Typography>
          <Typography variant="body1" style={{ marginTop: "10px" }}>
            Click on the button below to bring your team.
          </Typography>
        </div>
      );
    }else if (match.Teams.length <= 2 && match.Teams.length > 0 ) {
      return (
        
        <Table>
        <TableHead>
          <TableRow>
            <TableCell>Team Name</TableCell>
            <TableCell>Players</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {match.Teams.map((team) => (
            <TableRow key={team._id}>
              <TableCell>{team.name}</TableCell>
              <TableCell>
                <div
                  style={{
                    maxHeight: "150px", 
                    overflowY: "auto", 
                    paddingLeft: "20px",
                  }}
                >
                  <ol style={styles.playerList}>
                    {team.team.map((player) => (
                      <li
                        key={player._id}
                        style={{
                          ...styles.playerItem,
                          display: "block",
                        }}
                      >
                        <span style={styles.playerName}>{player.name}</span>{" "}
                        ({player.role})
                      </li>
                    ))}
                  </ol>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
        
      );
    } else if(match.Teams.length > 2 && match.Teams.length < 8) {
      return (
        <div className="row">
          {match.Teams.map((team) => (
            <Accordion key={team._id} style={styles.teamAccordion}>
              <AccordionSummary
                expandIcon={<FontAwesomeIcon icon={faCaretDown} />}
                aria-controls={`team-details-${team._id}`}
                id={`team-details-${team._id}`}
              >
                <Typography style={styles.teamName}>{team.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div
                  style={{
                    minHeight: "300px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    className="team-image"
                    style={{
                      backgroundImage: `url(${team.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      width: "100%",
                      height: "100%",
                    }}
                  ></div>
                  <ol style={styles.playerList}>
                    {team.team.map((player) => (
                      <li key={player._id} style={styles.playerItem}>
                        <span style={styles.playerName}>{player.name}</span>{" "}
                        ({player.role})
                      </li>
                    ))}
                  </ol>
                </div>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      );
    }else{
      navigate("/matchfixture",{ state })
    }
  };

  return (
    <div style={styles.container} >
      <div className="center-container">
      {((countPlayersInTeam("Team1") >= 15) || (countPlayersInTeam("Team2") >= 15)) &&
        <Alert severity="warning" className="general-alert">
          This match is full please enter another match!
        </Alert>
      }
      </div>
      <div className="center-container">
      { matchAlert && (<Alert severity="success" className="general-alert">
            {matchAlert}
          </Alert>)
}
      </div>
      
        
        
      
      <div className="row">
        <div className="col-md-12" >
          <h1 className="team-heading">Cricket Teams</h1>
          <h2 className="team-subheading">{match?.type}</h2>
        </div>
      </div>
      {match && renderTeams()}
      <div style={styles.buttonContainer}>
        {((countPlayersInTeam('Team1')<15) ||(countPlayersInTeam('Team2')<15))&&<Button
          variant="contained"
          color="success"
          style={styles.button}
          onClick={handleClick}
        >
          Join Match
        </Button>}
      </div>
    </div>
  );
};



export default Team;


