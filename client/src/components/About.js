import { fontWeight } from "@mui/system";
import React from "react";
import cricketPassion from "./../img/cricketPassion.jpg";
import customerNeeds from "./../img/customerNeeds.jpeg";
import Accessibility from "./../img/Accessibility.jpg";
import Subscription from "./../img/Subscription.png";
import "./../styles/about.css";
const About = () => {
  return (
    <div className="about-container">
      <div className="about-heading">
        <h1>About Us</h1>
      </div>
      <div className="info-container">
        <div className="left-side">
          <h3 className="info-heading">Welcome to CricThrills - Where Passion for Cricket Unites!</h3>
          <p className="info-para">
            At CricThrills, we take immense pride in offering a dynamic platform
            that brings together cricket enthusiasts from all walks of life. Our
            website serves as a catalyst for creating unforgettable cricketing
            experiences, where the love for the game knows no boundaries.
          </p>
        </div>
        <div className="right-side">
          <img
            src={cricketPassion}
            alt="Cricket Passion"
            className="about-img"
          />
        </div>
      </div>
      <div
        className="info-container"
      >
        <div className="left-side">
          <img
            src={customerNeeds}
            alt="Customer Needs"
            className="about-img"
          />
        </div>
        <div className="right-side">
          <h3 className="info-heading">Our Commitment to Fulfilling Customer Needs</h3>
          <p className="info-para">
            We understand the challenges faced by cricket enthusiasts in Canada
            when it comes to forming a team due to busy schedules. To address
            this, our website provides a seamless solution by connecting
            individuals with like-minded players, making team formation an
            effortless endeavor. Say goodbye to the struggle of finding
            teammates and embrace the camaraderie that comes with cricketing
            together.
          </p>
        </div>
      </div>
      <div
      className="info-container"
      >
        <div className="left-side">
          <h3 className="info-heading">Our Impact - Bringing Accessibility and Efficiency</h3>
          <p  className="info-para">
            CricThrills is not just a website; it's a gateway to cricketing
            opportunities. Our platform is designed to be convenient and
            accessible, connecting individuals with a shared passion for
            cricket. With CricThrills, finding the right people to join you in a
            cricket match has never been easier.
          </p>
          <p className="info-para">
            In our pursuit of excellence, we prioritize efficient service
            delivery. From renting equipment to arranging the cricket field, we
            streamline every step to ensure you can focus on what truly matters
            - playing the game you love.
          </p>
        </div>
        <div className="right-side">
          <img
            src={Accessibility}
            alt="Accessibility"
            className="about-img"
          />
        </div>
      </div>
      <div
      className="info-container"
      >
        <div className="left-side">
          <img
            src={Subscription}
            alt="Subscription"
            className="about-img"
          />
        </div>
        <div className="right-side">
          <h3 className="info-heading">Embrace the CricThrills Subscription Experience</h3>
          <p className="info-para">
            CricThrills operates on a subscription-based model, offering you
            ultimate convenience and flexibility. Choose between our affordable
            monthly plan for $14.99 or the value-packed annual plan for $99.99.
            Once subscribed, you gain access to a world of cricketing joy, where
            you can enroll yourself in exciting fun matches or rally your team
            for exhilarating tournaments.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
