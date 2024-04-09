const express = require('express')

const AllMatches = require('../models/AllMatches')
const fetchUser = require('../middleware/fetchuser')
const router = express.Router()
//Route 1: create a Match : POST '/api/allmatches/addallmatch'. Doesn't require auth

router.post('/addallmatch',async(req,res)=>{ 
try {
  //creating a new user
  const match = await AllMatches.create({
    Teams: req.body.Teams,
    type: req.body.type,
    location: req.body.location,
    date: req.body.date,
    time: req.body.time,
    address: req.body.address,
  })
  const data = {
    match:{
        id: match.id
    }
  }
  await match.save();

 res.json({data})
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error")
}
})
//Route 2: get matches: POST "/api/allmatches/getmatches". login required
router.get('/getmatches', async (req, res) => {
    try {
      const matchId = req.headers['match-id']; // Extract the match ID from the headers
      const match = await AllMatches.findById(matchId);
      res.json({ match });
    } catch (error) {
      console.error(error.message);
      res.status(500).send({error});
    }
  });
  // Route: Get all matches - GET "/api/allmatches/fetchallmatches"
router.get("/fetchallmatches", async (req, res) => {
  try {
    const matches = await AllMatches.find();
    res.json(matches);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
// ROUTE 4: Update an existing Note using: PUT "/api/allmatches/updatematch". Login required
router.put('/updatematch/:id', async (req, res) => {
  const {Teams} = req.body;
  try {
      // Create a newNote object
      const newMatch = {};
      newMatch.Teams = Teams

      // Find the note to be updated and update it
      let match = await AllMatches.findById(req.params.id);
      if (!match) { return res.status(404).send("Not Found") }
      match = await AllMatches.findByIdAndUpdate(req.params.id, { $set: newMatch }, { new: true })
      res.json({ match });
  } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
  }
})
module.exports = router;