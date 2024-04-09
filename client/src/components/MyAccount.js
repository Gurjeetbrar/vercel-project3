import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Typography, Card, CardContent } from "@mui/material";
import Alert from '@mui/material/Alert';
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
const MyAccount = () => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [infoAlert, setInfoAlert] = useState(null)
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const backendUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:5000'; 
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUser();
    setInfoAlert(localStorage.getItem('infoAlert'))
  }, []);
  useEffect(() => {
    if (infoAlert) {
      

      // Hide the success alert after five seconds
      const timer = setTimeout(() => {
        alertSuccess()
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [infoAlert]);

  const alertSuccess = () => {
    setInfoAlert(null);
    localStorage.removeItem('infoAlert');
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
      setUser(data.user);
      console.log(data.user.birthDate)
    } catch (error) {
      console.log(error);
    }
  };

  // Calculate age in years, months, and days
  const calculateAge = (birthDate) => {
    const today = new Date(Date.now());
    const birthDateObj = new Date(birthDate);
  
    let yearsDiff = today.getFullYear() - birthDateObj.getFullYear();
    let monthsDiff = today.getMonth() - birthDateObj.getMonth();
    let daysDiff = today.getDate() - birthDateObj.getDate();
  
    // Adjust for negative months difference
    if (monthsDiff < 0 || (monthsDiff === 0 && daysDiff < 0)) {
      yearsDiff--;
      if (monthsDiff < 0) monthsDiff += 12;
      if (daysDiff < 0) {
        const prevMonthLastDay = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
        daysDiff = prevMonthLastDay - birthDateObj.getDate() + today.getDate();
        if (monthsDiff > 0) monthsDiff--;
      }
    }
  
    return { years: yearsDiff, months: monthsDiff };
  };
  
  const styles = {
    typographyStyles:{
      fontSize: isSmallScreen ? ".7rem":"1rem",
    },
    editLink: {
      textAlign: "center",
      marginTop: isSmallScreen ? 5:10,
      textDecoration: "none",
      color: "#fff",
      backgroundColor: "#3f51b5",
      padding: ".5rem .8rem",
      borderRadius: 4,
      fontSize: isSmallScreen ? ".7rem":"1rem",
    },
    typographyHeadingStyles:{
      fontWeight: "medium",
      fontSize: isSmallScreen ? "1rem":"1.5rem",
    }
  };
  


  return (
    <div>
      
        <div className="center-container">
          {
infoAlert && (
          <Alert severity="success" className="general-alert">
            {infoAlert}
          </Alert>
        )}
        </div>
        
      {user && (
        <Card style={{
          maxWidth:  isSmallScreen ?250:400,
          margin: "auto",
          marginTop: isSmallScreen ? "40%":"10%",
          marginBottom: isSmallScreen ? "40%":"10%",
          padding : isSmallScreen? 7: 20,

        }}>
          <CardContent sx={{fontSize:isSmallScreen ?15:30}}>
            <div className="center-container">
            <Typography variant="h5" gutterBottom style={styles.typographyHeadingStyles}>
              My Account
            </Typography>
            </div>
           
            <Typography variant="subtitle1" gutterBottom style={styles.typographyStyles}>
              Name: {user.name}
            </Typography>
            <Typography variant="subtitle1" gutterBottom style={styles.typographyStyles}> 
              Email: {user.email}
            </Typography>
            <Typography variant="subtitle1" gutterBottom style={styles.typographyStyles}>
              Phone: {user.phone}
            </Typography>
            <Typography variant="subtitle1" gutterBottom style={styles.typographyStyles}>
              Age: {calculateAge(new Date(user.birthDate)).years} years {calculateAge(new Date(user.birthDate)).months} months 
            </Typography>
           
          </CardContent>
          <div className="center-container">
          <Link to="/editUser" style={styles.editLink}>
              Edit Info
            </Link>
          </div>
          
        </Card>
      )}
    </div>
  );
};


export default MyAccount;


