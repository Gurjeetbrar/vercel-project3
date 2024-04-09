const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Match = require("../models/Match");
//Route 1: get all the matches: GET "/api/user/fetchallmatches". login required
router.get("/fetchallmatches", fetchuser, async (req, res) => {
  try {
    const matches = await Match.find({ user: req.user.id });
    res.json(matches);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
// Route 2: Add a new match: POST "/api/user/addmatch". Login required
router.post("/addmatch", fetchuser, async (req, res) => {
  try {
    const { id } = req.body; // Assuming you are sending the match details in the request body
    // Create a new instance of AllMatches and set its properties
    const newMatch = new Match({
      user: req.user.id,
      id: id,
      // ...
    });

    const savedMatch = await newMatch.save();
    res.json(savedMatch);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//Route 3: Delete an existing match using: DELETE "/api/matches/deletematch": login required
router.delete("/deletematch/:id", fetchuser, async (req, res) => {
  try {
    //find the match to be deleted  and delete it
    let match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).send("Not Found");
    }

    // allow deletion only if user owns this Note
    if (match.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    match = await Match.findByIdAndDelete(req.params.id);
    res.json({ Sucess: "Match has been deleted", match: match });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
