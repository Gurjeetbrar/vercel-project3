import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
import {disableReactDevTools, disableReactDevtoos} from '@fvilers/disable-react-devtools'
const options = {
  position: positions.TOP_RIGHT,
  timeout: 5000,
  offset: '30px',
  transition: transitions.SCALE,
  containerStyle: {
    zIndex: 1000,
    width: 'auto', // Adjust the width as per your requirement
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    backgroundColor: 'transparent', // Set the background color to 'transparent'
    boxShadow: 'none', // Remove the box shadow
    border: 'none', // Remove the border
    maxWidth: '100%',
    padding: '10px',
    marginTop: "28px",
    boxSizing: 'border-box',
  },
  messageStyle: {
    fontSize: '14px',
    fontWeight: 'normal',
    lineHeight: '1.5',
    color: '#333'
  },
  closeButtonStyle: {
    color: '#999',
    fontSize: '16px'
  }
};
if(process.env.NODE_ENV === 'production'){
  disableReactDevTools()
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AlertProvider template={AlertTemplate} {...options}>
    <App />
    </AlertProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
