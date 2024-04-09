import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Alert from "@mui/material/Alert";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useAlert } from "react-alert";
import {
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
} from "@mui/material";
import Modal from "@mui/material/Modal";

const JoinMatch = () => {
  const [playerCount, setPlayerCount] = useState(0);

  const [success, setSuccess] = useState(false);
  const [match, setMatch] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;
  const token = localStorage.getItem("token");
  const [matchIds, setMatchIds] = useState([]);
  const [checked, setChecked] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState("");
  const [membershipStatus, setMembershipStatus] = useState("");
  const backendUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:5000'; 
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchMatch();
    fetchUserMatches();
    fetchUser();
  }, []);
  useEffect(() => {
    if (membershipStatus === "none") {
      console.log("yes");
      const alert = "You have to be a member in order to enter the match!";
      localStorage.setItem("becomeMemberAlert", alert);
      navigate("/mymembership");
    }
  }, [membershipStatus]);

  const fetchUserMatches = async () => {
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
  const fetchUser = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/getuser`, {
        method: "POST",
        headers: {
          "auth-token": token,
        },
      });
      const data = await response.json();
      if (data.user) {
        setMembershipStatus(data.user.membershipStatus);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [teamData, setTeamData] = useState({
    teamName: "",
    players: [{ name: "", role: "" }], // Initial player field
  });

  const handleDataChange = (e, index) => {
    const { name, value } = e.target;
    const updatedPlayers = [...teamData.players];
    updatedPlayers[index] = { ...updatedPlayers[index], [name]: value };

    setTeamData({ ...teamData, players: updatedPlayers });
  };

  const addTeam = async () => {
    const { teamName, players } = teamData;
    const updatedTeams = [...match.Teams];

    // Add the new team with players to the match
    updatedTeams.push({ name: teamName, team: players });

    try {
      const putResponse = await fetch(
        `${backendUrl}/api/allmatches/updatematch/${state.matchId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Teams: updatedTeams }),
        }
      );

      const jsonResponse = await putResponse.json();
      const addMatch = await fetch(
        `${backendUrl}/api/matches/addmatch`,
        {
          method: "POST",
          headers: {
            "auth-token": token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: state.matchId }),
        }
      );
      const addMatchResponse = await addMatch.json();
    } catch (error) {
      console.log(error);
    }
  };

  const checkMatch = () => {
    let matchExists = false;
    matchIds.forEach((id) => {
      if (id === state.matchId) {
        matchExists = true;
      }
    });
    return matchExists;
  };

  const handleDataSubmit = async (e) => {
    e.preventDefault();

    const emptyPlayerField =
      teamData.players.find((player) => !player.name || !player.role) &&
      !teamData.team;
    if (emptyPlayerField) {
      setAlert("Please fill out all player fields.");
      setShowAlert(true);
      window.scrollTo(0, 0);
      return;
    } else if (!checked) {
      setAlert("Please agree to the Terms and Conditions.");
      setShowAlert(true);
      window.scrollTo(0, 0);
      return;
    }
    if (!checkMatch()) {
      if (teamData.players.length !== 15) {
        setAlert("Please add exactly 15 players!");
        setShowAlert(true);
        window.scrollTo(0, 0);
        return;
      }

      await addTeam();
      const alert = "You have successfully entered into match!";
      localStorage.setItem("matchAlert", alert);
      navigate("/team", { state });
      return;
    }
    setTeamData({ teamName: "", players: [] });
  };

  const addPlayerField = () => {
    setPlayerCount(playerCount + 1);
    setTeamData({
      ...teamData,
      players: [...teamData.players, { name: "", role: "" }],
    });
  };

  if (!match) {
    return <div>Loading...</div>;
  }

  const toggleInfoModal = () => {
    setShowInfoModal(!showInfoModal);
  };
  const styles = {
    container: {
      maxWidth: isSmallScreen ? "200" : "400px",
      margin: isSmallScreen ? "30% 10%" : "7rem auto",
      padding: "15px",
      backgroundColor: "#f5f5f5",
      borderRadius: "5px",
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
      fontSize: isSmallScreen ? ".75rem" : "1rem",
    },
    button: {
      backgroundColor: "#088A08",
      color: "#fff",
      padding: isSmallScreen ? "8px 15px" : "10px 20px",
      borderRadius: "5px",
      border: "none",
      cursor: "pointer",
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
      fontSize: isSmallScreen ? ".7rem" : ".9rem",
    },
    formGroup: {
      marginBottom: "20px",
    },
    playerField: {
      marginBottom: "20px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      padding: "10px",
    },
    modalContainer: {
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "5px",
      maxWidth: "400px",
      margin: isSmallScreen ? "3rem" : "4rem auto",
    },
    input: {
      width: "100%",
      padding: "",
      padding: isSmallScreen ? "5px" : "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      boxSizing: "border-box",
    },
  };
  return (
    <div>
      <div className="center-container">
          {checkMatch() && (
            <Alert severity="error" className="general-alert">
              You have already registered for this match!
            </Alert>
          )}
        </div>
      <div style={styles.container}>
        <div className="center-container">
          <Typography
            variant="h5"
            gutterBottom
            style={{
              marginTop: isSmallScreen ? ".5rem" : "1rem",
              fontSize: isSmallScreen ? "1.2rem" : "2rem",
            }}
          >
            Join Match
          </Typography>
        </div>
        {showAlert && <div className="signup-alert">{alert}</div>}
        

        <form onSubmit={handleDataSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="teamName">Team Name:</label>
            <input
              type="text"
              id="teamName"
              name="teamName"
              value={teamData.teamName}
              onChange={(e) =>
                setTeamData({ ...teamData, teamName: e.target.value })
              }
              required
              style={styles.input}
            />
          </div>

          <Typography
            variant="h6"
            gutterBottom
            style={{ fontSize: isSmallScreen ? "1rem" : "1.5rem" }}
          >
            Players
          </Typography>
          {teamData.players.map((player, index) => (
            <div key={index} style={styles.playerField}>
              <div style={styles.formGroup}>
                <Typography
                  variant="body1"
                  style={{ fontSize: isSmallScreen ? "1rem" : "1.3rem" }}
                >
                  Player {index + 1}
                </Typography>
                <label htmlFor={`playerName${index}`}>Name:</label>
                <input
                  type="text"
                  id={`playerName${index}`}
                  name="name"
                  value={player.name}
                  onChange={(e) => handleDataChange(e, index)}
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor={`playerRole${index}`}>Role:</label>
                <select
                  id={`playerRole${index}`}
                  name="role"
                  value={player.role}
                  onChange={(e) => handleDataChange(e, index)}
                  required
                  style={styles.input}
                >
                  <option value="">Select a role</option>
                  <option value="Batsman">Batsman</option>
                  <option value="Bowler">Bowler</option>
                  <option value="Wicketkeeper">Wicketkeeper</option>
                  <option value="All Rounder">All Rounder</option>
                </select>
              </div>
            </div>
          ))}
          <div className="center-container">
            {
              teamData.players.length < 15 && <button
              type="button"
              className="button"
              onClick={addPlayerField}
              style={styles.button}
            >
              Add Player
            </button>
            }
            
          </div>
          <div style={{ textAlign: "center", margin: "3%" }}>
            <label
              htmlFor="termsCheckbox"
              style={{ fontSize: isSmallScreen ? ".8rem" : "1rem" }}
            >
              <input
                type="checkbox"
                id="termsCheckbox"
                checked={checked}
                onChange={() => setChecked(!checked)}
              />
              I agree to the{" "}
              <a
                onClick={toggleInfoModal}
                style={{
                  color: "blue",
                  textDecoration: "none",
                  pointer: "cursor",
                }}
              >
                Terms and Conditions
              </a>
            </label>
          </div>

          <div className="center-container">
            <button type="submit" className="button" style={styles.button}>
              Submit
            </button>
          </div>
        </form>

        <Modal open={showInfoModal} onClose={toggleInfoModal}>
          <div style={styles.modalContainer}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <IconButton
                edge="end"
                color="inherit"
                onClick={toggleInfoModal}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </div>
            <Typography
              variant="h6"
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "2%",
                fontWeight: "bold",
                fontSize: isSmallScreen ? "1rem" : "1.3rem",
              }}
            >
              Terms and Conditions
            </Typography>
            <Typography
              variant="body1"
              style={{ fontSize: isSmallScreen ? ".7rem" : "1rem" }}
            >
              Player must be 18 or above to enroll in the match. If the player
              is found to be less than 18, then player would not be allowed to
              play. Captain should make sure that every player is 18 or above.
            </Typography>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default JoinMatch;
