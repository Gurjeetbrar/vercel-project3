import React, { useState } from 'react';
import Signup from './Signup';
import { useNavigate ,Link} from 'react-router-dom';
import './../styles/login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showAlert, setShowAlert] = useState(false);
  let navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:5000'; 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`${backendUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    const json = await response.json();
    console.log(json);
    if (json.success) {
      // save the auth token and redirect
      localStorage.setItem('token', json.authToken);
      const alert = "You have logged in successfully!"
      localStorage.setItem('loginAlert', alert)
      navigate('/');
    } else {
      setShowAlert(true);
    }
    
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    <Signup />;
  };

  return (
    <div className="login-container">
      <div className="center-container">
        <h2 className='login-heading'>Login</h2>
      </div>
      {showAlert && <div className="login-alert">Invalid credentials. Please try again.</div>}
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          className="login-input"
          type="email"
          id="email"
          name="email"
          value={credentials.email}
          onChange={onChange}
          placeholder="Email"
        />
        <input
          className="login-input"
          type="password"
          id="password"
          name="password"
          onChange={onChange}
          value={credentials.password}
          placeholder="Password"
        />
        <button className="Loginbutton">Login</button>
      </form>
      <p className="signupText">
        Don't have an account? <Link to="/signup" className="signup-link">
        Sign up
      </Link>
      </p>
    </div>
  );
};

export default Login;

