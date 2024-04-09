import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const EditInfo = () => {
  const [user, setUser] = useState(null);
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    phone: "",
    birthDate: "",
  });
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const backendUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:5000'; 

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/getuser`, {
        method: "POST",
        headers: {
          "auth-token": token,
        },
      });
      const data = await response.json();
      setUser(data.user);
      const formattedBirthDate = data.user.birthDate
        ? new Date(data.user.birthDate).toISOString().slice(0, 10)
        : "";
      setCredentials({
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        birthDate: formattedBirthDate,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const editUser = async () => {
    try {
      const { name, email, phone, birthDate } = credentials;
      const response = await fetch(`${backendUrl}/api/auth/edituser`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          birthDate,
        }),
      });
      const data = await response.json();
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await editUser();
    const alert = "Your personal information is updated successfully!";
    localStorage.setItem("infoAlert", alert);
    navigate("/myaccount");
  };
  const styles = {
    card: {
      maxWidth: isSmallScreen ? 350 : 400,
      margin: "auto",
      marginTop: isSmallScreen ? "30%" : "15%",
      marginBottom: isSmallScreen ? "30%" : "10%",
      padding: isSmallScreen ? 5 : 20,
    },
    textField: {
      margin: isSmallScreen ? 7:10,
      fontSize: isSmallScreen ? "0.8rem" : "1rem",
    },
    saveButton: {
      display: "block",
      margin: "20px auto",
      textDecoration: "none",
      color: "#fff",
      backgroundColor: "#3f51b5",
      borderRadius: 4,
      textAlign: "center",
      marginTop: isSmallScreen ? 7:10,
      padding: ".5rem .8rem",
      fontSize: isSmallScreen ? ".7rem":"1rem",
    },
    typographyHeadingStyles:{
      fontWeight: "medium",
      fontSize: isSmallScreen ? "1.1rem":"1.5rem",
    }
  };
  return (
    <div>
      {user && (
        <Card style={styles.card} >
          <CardContent >
            <div className="center-container">
            <Typography variant="h5" gutterBottom style={styles.typographyHeadingStyles}>
              Edit Information
            </Typography>
            </div>
            
            <form onSubmit={handleSubmit}>
              <TextField
                label="Name"
                value={credentials.name}
                onChange={(e) =>
                  setCredentials({
                    ...credentials,
                    name: e.target.value,
                  })
                }
                style={styles.textField}
                sx={{size:'large'}}
                fullWidth
                required
              />
              <TextField
                label="Email"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({
                    ...credentials,
                    email: e.target.value,
                  })
                }
                style={styles.textField}
                fullWidth
                required
              />
              <TextField
                label="Phone"
                value={credentials.phone}
                onChange={(e) =>
                  setCredentials({
                    ...credentials,
                    phone: e.target.value,
                  })
                }
                style={styles.textField}
                fullWidth
                required
                inputProps={{ maxLength: 10 }}
              />
              <TextField
                label="Birth Date"
                type="date"
                value={credentials.birthDate}
                onChange={(e) =>
                  setCredentials({
                    ...credentials,
                    birthDate: e.target.value,
                  })
                }
                style={styles.textField}
                fullWidth
                required
              />

              <Button
                variant="contained"
                color="primary"
                type="submit"
                style={styles.saveButton}
              >
                Save
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};



export default EditInfo;
