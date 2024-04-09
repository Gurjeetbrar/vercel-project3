import React from "react";
import logo from "./../img/Logo.png";
import "./../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-logo">
        <img src={logo} alt="CricThrlls Logo" className="logoImg" />
        <h2 className="footer-title">CricThrills</h2>
      </div>
      <div>
        <h5 className="footer-made-with">
          Made with ❤️ by Gurjeet, Sukhman, and Anmol
        </h5>
      </div>
      <div className="footer-info">
        <div className="contact-container">
          <div className="contact-item">
            <p className="footer-text">123 Main Street, Surrey</p>
            <p className="footer-text">Canada, V3W6C1</p>
          </div>
          <div className="contact-item">
            <p className="footer-text">Phone: +1 (123) 456-7890</p>
            <p className="footer-text">Email: info@cricthrlls.com</p>
          </div>
        </div>
        
      </div>
      <div className="footer-social">
          <a
            href="https://facebook.com/gurjeet.brar.5667"
            target="_blank"
            className="social-link"
          >
            <i className="fab fa-facebook"></i>
          </a>
          <a
            href="https://www.linkedin.com/in/cout-gurjeetsingh/"
            target="_blank"
            className="social-link"
          >
            <i className="fab fa-linkedin"></i>
          </a>
          <a
            href="https://www.instagram.com/brar_gurjeet1009/?hl=en"
            target="_blank"
            className="social-link"
          >
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      <div className="footer-text">
        <p>© 2023 CricThrlls. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
