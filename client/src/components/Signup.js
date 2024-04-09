import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/signup.css";
import TextField from "@mui/material/TextField";
import moment from "moment";
import "./../styles/login.css"
const Signup = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    cpassword: "",
    birthDate: null,
  });

  const [alert, setAlert] = useState("");
  let navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:5000'; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !credentials.name ||
      !credentials.email ||
      !credentials.phone ||
      !credentials.birthDate ||
      !credentials.password ||
      !credentials.cpassword
    ) {
      setAlert("Please fill out all the fields.");
      window.scrollTo(0, 0);
      setShowAlert(true);
      return;
    }else if(credentials.password.length < 8){
      setAlert("Password length must be at least 8.");
      window.scrollTo(0, 0);
      setShowAlert(true);
      return;
    }
    const { name, email, password, phone, cpassword, birthDate } = credentials;
    if (password !== cpassword) {
      setAlert("Passwords do not match.");
      setShowAlert(true);
      return;
    }
    const response = await fetch(`${backendUrl}/api/auth/createuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        phone,
        birthDate: birthDate,
      }),
    });

    const json = await response.json();
    console.log(json);
    // save the auth token and redirect
    if (json.success) {
      // save the auth token and redirect
      localStorage.setItem("token", json.authToken);
      navigate("/login");
    } else {
      setAlert("Email or Mobile Number already exist");
      setShowAlert(true);
    }
    console.log(credentials.birthDate)
  };

  const handleChange = (e) => {
    if (e.target.name === "birthDate") {
      const formattedDate = moment(e.target.value).format("YYYY-MM-DD");
      setCredentials({
        ...credentials,
        birthDate: formattedDate,
      });
    } else {
      setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }
  };

  return (
    <div className="signup-container">
      <div className="center-container">
        <h2 className="login-heading">Sign up</h2>
      </div>

      {showAlert && <div className="login-alert">{alert}</div>}
      <form className="signup-form" onSubmit={handleSubmit}>
        <input
          className="signup-input"
          type="text"
          name="name"
          id="name"
          value={credentials.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          className="signup-input"
          type="email"
          id="email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          placeholder="Email"
          minLength={3}
          required
        />
        <input
          className="signup-input"
          type="tel"
          id="phone"
          name="phone"
          value={credentials.phone}
          onChange={handleChange}
          placeholder="Mobile Number"
          minLength={10}
          maxLength={10}
          required
        />
        <div className="date-input">
          
        
        <TextField
            id="birthDate"
            name="birthDate"
            label="Birth Date"
            style={{width:'100%'}}
            type="date"
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          </div>

        <input
          className="signup-input"
          type="password"
          id="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          placeholder="Password"
          required
          minLength={8}
        />
        <input
          className="signup-input"
          type="password"
          id="cpassword"
          name="cpassword"
          value={credentials.cpassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          required
          minLength={8}
        />
      </form>
      <div className="center-container">
        <button className="signup-button" onClick={handleSubmit}>
          Signup
        </button>
      </div>
    </div>
  );
};

export default Signup;

