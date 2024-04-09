const express = require("express");

const User = require("../models/User");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const { body, validationResult } = require("express-validator");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const JWT_SECRET = "HarryISgoodboy$";
//Route 1: create a user using : POST '/api/auth/createuser'. Doesn't require auth

router.post(
  "/createuser",
  [
    body("email", "Enter a vailid email").isEmail(),
    body("password", "Enter a vailid password(at Least 5 letter)").isLength({
      min: 5,
    }),
    body("name", "Enter a vailid name").isLength({ min: 3 }),
    body("birthDate", "Enter a valid birth date").isDate(), // Validate birth date as ISO 8601 format
    body("phone", "Enter a vailid mobile number").isLength({
      min: 10,
      max: 10,
    })
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({
            success,
            error: "Sorry a user with this email already exists",
          });
      }
      let user2 = await User.findOne({ phone: req.body.phone });
      if (user2) {
        return res
          .status(400)
          .json({
            error: "Sorry a user with this mobile number already exists",
          });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      //creating a new user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
        phone: req.body.phone,
        birthDate: req.body.birthDate,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  }
);
//Route 2: authenticate a user using: POST "/api/auth/login". no login required
router.post(
  "/login",
  [
    body("email", "Enter a vailid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res
          .status(400)
          .json({
            success,
            error: "Please try to login with correct credentials",
          });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//Route 3: get loggedin user details using: POST "/api/auth/getuser". login required
router.post("/getuser", fetchuser, async (req, res) => {
  let success = false;
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.json({ success, user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
//Route 4: edit user info POST "/api/auth/edituser". login required
router.put("/edituser", fetchuser, async (req, res) => {
  try {
    const moment = require("moment");
    const { name, email, phone, birthDate, membershipStatus ,membershipDate} = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user information
    user.name = name || user.name; // If name is not provided, keep the existing name
    user.email = email || user.email; // If email is not provided, keep the existing email
    user.phone = phone || user.phone; // If phone is not provided, keep the existing phone
    user.birthDate = birthDate || user.birthDate; // If birthDate is not provided, keep the existing birthDate
    user.membershipStatus = membershipStatus || user.membershipStatus; // If membershipStatus is not provided, keep the existing membershipStatus
    user.membershipDate = membershipDate || user.membershipDate;
    const updatedUser = await user.save();

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({error});
  }
});
module.exports = router;
