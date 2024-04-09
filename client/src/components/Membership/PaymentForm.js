import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import "./../../styles/paymentForm.css"

const PaymentForm = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [name, setName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState(null);
  const [cvv, setCvv] = useState('');
  const [address, setAddress] = useState('');
  const [pinCode, setPinCode] = useState('');
  const location = useLocation();
  const state = location.state;
  const currentDate = moment().format('YYYY-MM-DD');
  const backendUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:5000'; 

  const handleSubmit = async (event) => {
    event.preventDefault();
    await editUser();
    const alert = "You have successfully enrolled into membership!"
    localStorage.setItem('membershipAlert', alert)
    navigate('/mymembership',{state});
  };
  console.log(token)

  const editUser = async () => {
    const response = await fetch(`${backendUrl}/api/auth/edituser`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token,
      },
      body: JSON.stringify({
        membershipDate: currentDate,
        membershipStatus: state,
      }),
    });

    const json = await response.json();
    console.log(json);
  };

  const handleExpiryChange = (date) => {
    setExpiry(date);
  };

  const validateForm = () => {
    // Add your form validation logic here
    // Return true if the form is valid, false otherwise
    return true;
  };

  const handlePinCodeChange = (event) => {
    const pinCodeValue = event.target.value;
    setPinCode(pinCodeValue);
  };
  

  return (
    <div className="payment-form">
      <h2 className="form-title">Payment Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" className="payment-label">
            Name on Card
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="payment-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="cardNumber" className="payment-label">
            Card Number
          </label>
          <input
            type="text"
            id="cardNumber"
            value={cardNumber}
            onChange={(event) => setCardNumber(event.target.value)}
            required
            className="payment-input"
            maxLength={16}
            minLength={16}
          />
        </div>

        <div className="form-group">
          <label htmlFor="expiry" className="payment-label">
            Expiry Date
          </label>
          <DatePicker
            id="expiry"
            selected={expiry}
            onChange={handleExpiryChange}
            required
            className="payment-input"
            dateFormat="MM/yyyy"
            showMonthYearPicker
          />
        </div>

        <div className="form-group">
          <label htmlFor="cvv" className="payment-label">
            CVV
          </label>
          <input
            type="text"
            id="cvv"
            value={cvv}
            onChange={(event) => setCvv(event.target.value)}
            required
            className="payment-input"
            maxLength={3}
            minLength={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="address" className="payment-label">
            Address
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            required
            className="payment-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="pinCode" className="payment-label">
            Postal Code
          </label>
          <input
            type="text"
            id="pinCode"
            value={pinCode}
            onChange={handlePinCodeChange}
            required
            className="payment-input"
            maxLength={7}
            minLength={6}
          />
        </div>
        <div className='center-container'>
        <button type="submit" className="submit-button" disabled={!validateForm()}>
          Submit
        </button>
        </div>

        
      </form>

    </div>
  );
};

export default PaymentForm;
