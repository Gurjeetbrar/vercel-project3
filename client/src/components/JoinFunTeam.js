import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Alert from "@mui/material/Alert";
import { useAlert } from "react-alert";
import Modal from "@mui/material/Modal"; 
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
} from "@mui/material";
const JoinTeam = () => {
  const [success, setSuccess] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [match, setMatch] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;
  const token = localStorage.getItem("token");
  const [matchIds, setMatchIds] = useState([]);
  const [membershipStatus, setMembershipStatus] = useState("");
  const [checked, setChecked] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [birthDate, setBirthDate] = useState(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [alert, setAlert] = useState("");
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
  const countPlayersInTeam = (teamName) => {
    if (!match) return 0;
    const team = match.Teams.find((t) => t.name === teamName);
    return team ? team.team.length : 0;
  };
  const toggleInfoModal = () => {
    setShowInfoModal(!showInfoModal);
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
        setBirthDate(data.user.birthDate);
        setMembershipStatus(data.user.membershipStatus);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const calculateAge = (birthDate) => {
    if (!birthDate) {
      return null;
    }
    const today = new Date();
    const birthDateObj = new Date(birthDate);

    let yearsDiff = today.getFullYear() - birthDateObj.getFullYear();

    return { years: yearsDiff };
  };
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

  const [personalData, setPersonalData] = useState({
    name: "",
    role: "",
    team: "",
    mobileNumber: "",
    address: "",
  });

  const addPlayer = async () => {
    const { name, role, team } = personalData;
    if (!match) {
      return;
    }

    const updatedTeams = [...match.Teams];
    const teamIndex = updatedTeams.findIndex((t) => t.name === team);

    if (teamIndex !== -1) {
      // Add the new player to the team
      updatedTeams[teamIndex].team.push({ name, role });

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

        if (jsonResponse.success && addMatchResponse.success) {
          setSuccess(true);
        }
      } catch (error) {
        console.log(error);
      }
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

  const handleDataChange = async (e) => {
    setPersonalData({ ...personalData, [e.target.name]: e.target.value });
  };

  const handleDataSubmit = async (e) => {
    e.preventDefault();
    if (membershipStatus === "none") {
      const alert = "You have to be a member in order to enter the match!";
      localStorage.setItem("becomeMemberAlert", alert);
      console.log(localStorage.getItem("becomeMemberAlert"))
      const navigation = "joinfunteam";
      localStorage.setItem("navigation", navigation);
      navigate("/mymembership");
      return;
    }
    if (
      !personalData.name ||
      !personalData.role ||
      !personalData.team ||
      !personalData.mobileNumber||
      !personalData.address
    ) {
      setAlert("Please fill out all the fields.");
      setShowAlert(true);
      window.scrollTo(0, 0);
      return;
    }else if(!checked){
      setAlert("Please agree to the Terms and Conditions.");
      setShowAlert(true);
      window.scrollTo(0, 0);
      return;
    }
    if (verifyAge(birthDate)) {
      return;
    }
    if (!checkMatch()) {
      await addPlayer();
      const alert1 = "You have successfully entered into match!";
      localStorage.setItem("matchAlert", alert1);
      navigate("/team", { state });
      return;
    }
  };
  const verifyAge = (birthDate) => {
    if (birthDate) {
      if (calculateAge(new Date(birthDate)).years < 18) {
        return true;
      }
      return false;
    }
  };
  const styles = {
    container: {
      maxWidth: isSmallScreen? "200":"400px",
      margin: isSmallScreen? "30% 10%":"8rem auto",
      padding: "15px",
      backgroundColor: "#f5f5f5",
      borderRadius: "5px",
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
      fontSize:isSmallScreen?".75rem":"1rem"
    },
    formGroup: {
      marginBottom: "20px",
    },
    modalContainer: {
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "5px",
      maxWidth: "400px",
      margin:isSmallScreen? '3rem':'4rem auto'
    },
    input: {
      width: "100%",
      padding: "",
      padding:isSmallScreen? '5px':'10px',
      borderRadius: "5px",
      border: "1px solid #ccc",
      boxSizing: "border-box",
    },
    textarea: {
      width: "100%",
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      boxSizing: "border-box",
      resize: "vertical",
      minHeight: "100px",
    },
    button: {
      backgroundColor: "#088A08",
      color: "#fff",
      padding:isSmallScreen? '8px 15px':'10px 20px',
      borderRadius: "5px",
      border: "none",
      cursor: "pointer",
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
      fontSize:isSmallScreen? '.7rem':'.9rem'
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "center",
    },
    label:{
      fontSize:isSmallScreen? '.8rem':'1rem'
    }
  };

  return (
    <div>
      <div style={styles.container}>
        <div className="center-container">
        {countPlayersInTeam("Team1") >= 15 ||
        countPlayersInTeam("Team2") >= 15 ? (
          <Alert
            severity="info"
            style={{fontSize:isSmallScreen? '.7rem':'.9rem', width: "100%", position: "sticky", top:isSmallScreen?"2.5rem": "3.5rem", zIndex: 1 }}
          >
            {countPlayersInTeam("Team1") >= 15
              ? "Team 1 is full!"
              : "Team 2 is full!"}
          </Alert>
          
        ) : null}
        </div>
        <div className="center-container">
        {verifyAge(birthDate) && (
          <Alert
            severity="error"
            style={{fontSize:isSmallScreen? '.7rem':'.9rem', width: "100%", position: "sticky", top:isSmallScreen?"2.5rem": "3.5rem", zIndex: 1 }}
          >
            You must be 18 or above in order to enter match!
          </Alert>
        )}
        </div>
        
        
          <div className="center-container">
          {checkMatch() && (
          <Alert
            severity="error"
            className="general-alert"
          >
            You have already registered for this match!
          </Alert>
        )}
          </div>
       
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h2 style={{marginTop:isSmallScreen? '.5rem':'1rem',fontSize:isSmallScreen? '1.2rem':'2rem'}}>Join Team</h2>
        </div>
        {showAlert && <div className="signup-alert">{alert}</div>}

        <form onSubmit={handleDataSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="name" style={styles.label}>Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={personalData.name}
              onChange={handleDataChange}
              required
              style={styles.input}

            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="role" style={styles.label}>Role:</label>
            <select
              id="role"
              name="role"
              value={personalData.role}
              onChange={handleDataChange}
              required
              style={styles.input}
            >
              <option value="">Select a role</option>
              <option value="Betsmen">Batsman</option>
              <option value="Bowler">Bowler</option>
              <option value="Wicketkeeper">Wicketkeeper</option>
              <option value="All Rounder">All Rounder</option>
            </select>
            <label htmlFor="team" style={styles.label}>Team:</label>
            <select
              id="team"
              name="team"
              value={personalData.team}
              onChange={handleDataChange}
              required
              style={styles.input}
            >
              <option value="">Select a team</option>
              {countPlayersInTeam("Team1") < 15 && (
                <option value="Team1">Team 1</option>
              )}
              {countPlayersInTeam("Team2") < 15 && (
                <option value="Team2">Team 2</option>
              )}
            </select>
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="mobileNumber" style={styles.label}>Mobile Number:</label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              value={personalData.mobileNumber}
              onChange={handleDataChange}
              required
              style={styles.input}
              maxLength={10}
              minLength={10}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="address" style={styles.label}>Address:</label>
            <textarea
              id="address"
              name="address"
              value={personalData.address}
              onChange={handleDataChange}
              required
              style={styles.textarea}
            />
          </div>
          <div style={{ textAlign: "center", margin: "3%" }}>
            <label htmlFor="termsCheckbox" style={{fontSize:isSmallScreen? '.8rem':'1rem'}}>
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
          <div style={styles.buttonContainer}>
            <button
              type="submit"
              style={styles.button}
              onClick={handleDataSubmit}
            >
              Submit
            </button>
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
                    fontSize:isSmallScreen? '1rem':'1.3rem'
                  }}
                >
                  Terms and Conditions
                </Typography>
                <Typography variant="body1" style={{fontSize:isSmallScreen? '.7rem':'1rem'}}>
                  Player must be 18 or above to enroll in the match. If the
                  player is found to be less than 18, then player would not be
                  allowed to play.
                </Typography>
              </div>
            </Modal>
          </div>
        </form>
      </div>
    </div>
  );
};



export default JoinTeam;
