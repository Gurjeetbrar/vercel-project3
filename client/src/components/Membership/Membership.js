import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import moment from "moment";
import Alert from "@mui/material/Alert";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
const Membership = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [membershipType, setMembershipType] = useState("");
  const [membershipStatus, setMembershipStatus] = useState("");
  const [membershipDate, setMembershipDate] = useState("");
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const navigate = useNavigate();
  const [isMembershipOptionSelected, setIsMembershipOptionSelected] =
    useState(false);
  const [membershipAlert, setMembershipAlert] = useState(null);
  const [becomeMemberAlert, setBecomeMemberAlert] = useState(null);
  const backendUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:5000'; 
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    } else {
      fetchUser();
    }
    setMembershipAlert(localStorage.getItem("membershipAlert"));
    const storedBecomeMemberAlert = localStorage.getItem("becomeMemberAlert");
    if (storedBecomeMemberAlert) {
      setBecomeMemberAlert(storedBecomeMemberAlert);
    }
  }, []);
  
  
  useEffect(() => {
    if (membershipAlert) {
      // Hide the success alert after five seconds
      const timer = setTimeout(() => {
        alertSuccess();
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [membershipAlert]);
  useEffect(() => {
    if (becomeMemberAlert) {
      // Hide the success alert after five seconds
      const timer = setTimeout(() => {
        alertSuccess1();
      }, 6000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [becomeMemberAlert]);

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
        setMembershipDate(data.user.membershipDate);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const editUser = async (updatedStatus) => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/edituser`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({
          membershipStatus: updatedStatus,
        }),
      });

      const json = await response.json();

      // Update the membership status immediately
      setMembershipStatus(updatedStatus);
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (date) => {
    return moment(date).format("MMMM Do, YYYY");
  };

  const calculateMembershipEndDate = (startDate, type) => {
    const endDate =
      type === "annual"
        ? moment(startDate).add(1, "year")
        : moment(startDate).add(1, "month");
    return formatDate(endDate);
  };

  const handleConfirmationDialogOpen = () => {
    setConfirmationDialogOpen(true);
  };

  const handleConfirmationDialogClose = () => {
    setConfirmationDialogOpen(false);
  };

  const handleEndMembership = async () => {
    await editUser("none");
    await fetchUser();
    handleConfirmationDialogClose();
  };
  const alertSuccess = () => {
    setMembershipAlert(null);
    localStorage.removeItem("membershipAlert");
  };
  const alertSuccess1 = () => {
    console.log("yes");
    setBecomeMemberAlert(null);
    localStorage.removeItem("becomeMemberAlert"); // Remove the item from localStorage
  };

  const handleMembershipTypeChange = (e) => {
    setMembershipType(e.target.value);

    setIsMembershipOptionSelected(!!e.target.value);
  };
  const styles = {
    typographyStyles: {
      fontSize: isSmallScreen ? ".7rem" : "1rem",
    },
    typographyHeadingStyles: {
      fontWeight: "medium",
      fontSize: isSmallScreen ? "1rem" : "1.5rem",
      marginBottom: isSmallScreen ? 10 : 20,
    },
    card: {
      backgroundColor: "white",
      color: "black",
      maxWidth: isSmallScreen ? 250 : 400,
      margin: "auto",
      marginTop: isSmallScreen ? "40%" : "10%",
      marginBottom: isSmallScreen ? "40%" : "10%",
      padding: isSmallScreen ? 5 : 20,
    },
    endMembershipButton: {
      backgroundColor: "#F44336",
      color: "white",
      textAlign: "center",
      marginTop: isSmallScreen ? 8 : 10,
      padding: isSmallScreen ? ".4rem .5rem" : ".5rem .8rem",
      borderRadius: 4,
      fontSize: isSmallScreen ? ".6rem" : ".75rem",
    },
    radioGroup: {
      marginTop: 10,
    },
    radioLabel: {
      fontSize: isSmallScreen ? "0.7rem" : "1rem",
    },
    enrollButton: {
      backgroundColor: "#4CAF50",
      color: "white",
      textAlign: "center",
      marginTop: isSmallScreen ? 8 : 10,
      padding: isSmallScreen ? ".4rem .5rem" : ".5rem .8rem",
      borderRadius: 4,
      fontSize: isSmallScreen ? ".6rem" : "1rem",
    },
    dialog: {
      margin: isSmallScreen ? "auto 10%" : "0 30%",
    },
    dialogButton: {
      fontSize: isSmallScreen ? ".6rem" : ".8rem",
      padding: isSmallScreen ? ".3rem" : ".6rem",
    },
  };

  return (
    <div>
      {membershipStatus !== "none" && (
        <>
          <div className="center-container">
            {membershipAlert && (
              <Alert severity="success" className="general-alert">
                {membershipAlert}
              </Alert>
            )}
          </div>

          <Card style={styles.card}>
            <CardContent>
              <div className="center-container">
                <Typography
                  style={styles.typographyHeadingStyles}
                  variant="h5"
                  gutterBottom
                >
                  Membership Details
                </Typography>
              </div>
              <Typography
                variant="subtitle1"
                gutterBottom
                style={styles.typographyStyles}
              >
                Membership Type:{" "}
                {membershipStatus === "annual" ? "Annual" : "Monthly"}
              </Typography>
              <Typography
                variant="subtitle1"
                gutterBottom
                style={styles.typographyStyles}
              >
                Starting Date: {formatDate(membershipDate)}
              </Typography>
              <Typography
                variant="subtitle1"
                gutterBottom
                style={styles.typographyStyles}
              >
                Ending Date:{" "}
                {calculateMembershipEndDate(membershipDate, membershipStatus)}
              </Typography>
              <div className="center-container">
                <Button
                  variant="contained"
                  color="primary"
                  style={styles.endMembershipButton}
                  onClick={handleConfirmationDialogOpen}
                >
                  Cancel Membership
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {membershipStatus === "none" && (
        <>
          <div className="center-container">
            {becomeMemberAlert && (
              <Alert severity="error" className="general-alert">
                {becomeMemberAlert}
              </Alert>
            )}
          </div>
          <Card style={styles.card}>
            <CardContent>
              <div className="center-container">
                <Typography
                  variant="h5"
                  gutterBottom
                  style={styles.typographyHeadingStyles}
                >
                  Membership
                </Typography>
              </div>

              <Typography
                variant="subtitle1"
                gutterBottom
                style={styles.typographyStyles}
              >
                Choose your membership option:
              </Typography>

              <RadioGroup
                value={membershipType}
                onChange={handleMembershipTypeChange}
                style={styles.radioGroup}
              >
                <FormControlLabel
                  value="annual"
                  control={<Radio />}
                  label={
                    <Typography style={styles.radioLabel}>
                      Annual Membership (worth $99.99)
                    </Typography>
                  }
                />
                <FormControlLabel
                  value="monthly"
                  control={<Radio />}
                  label={
                    <Typography style={styles.radioLabel}>
                      Monthly Membership (worth $14.99)
                    </Typography>
                  }
                />
              </RadioGroup>

              {isMembershipOptionSelected ? (
                <Link
                  to="/mypayment"
                  state={membershipType}
                  style={{ textDecoration: "none", color: "#fff" }}
                >
                  <div className="center-container">
                    <Button
                      variant="contained"
                      color="success"
                      style={styles.enrollButton}
                    >
                      Enroll
                    </Button>
                  </div>
                </Link>
              ) : (
                <Alert
                  severity="warning"
                  style={{
                    marginTop: "1rem",
                    fontSize: isSmallScreen ? "0.7rem" : "1rem",
                  }}
                >
                  Please select a membership option to proceed.
                </Alert>
              )}
            </CardContent>
          </Card>
        </>
      )}

      <Dialog
        open={confirmationDialogOpen}
        onClose={handleConfirmationDialogClose}
        sx={styles.dialog}
      >
        <DialogTitle sx={{ fontSize: isSmallScreen ? "1.2rem" : "1.5rem" }}>
          Confirmation
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: isSmallScreen ? ".6rem" : "1rem" }}>
            Are you sure you want to end your membership? (Note: There will be
            no refund!)
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleConfirmationDialogClose}
            sx={styles.dialogButton}
            color="primary"
          >
            No
          </Button>
          <Button
            onClick={handleEndMembership}
            color="primary"
            variant="contained"
            sx={styles.dialogButton}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Membership;
