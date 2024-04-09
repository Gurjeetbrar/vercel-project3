const connectToMongoose = require('./db')
const express = require('express')
const cors = require('cors');
const port = process.env.PORT || 5000
connectToMongoose()
let REACT_APP_BASE_URL;
if(port === 5000){
  REACT_APP_BASE_URL = 'http://localhost:3000'
}else{
  REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL
}
console.log(REACT_APP_BASE_URL)
const app = express()
app.use(cors({
  origin: REACT_APP_BASE_URL, // Replace with your frontend's URL
  methods: ['GET', 'POST','PUT'], // Add more methods if needed
  allowedHeaders: ['Content-Type', 'auth-token','match-id'], // Add your custom headers here
  credentials: true,
}));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, match-id');
  next();
});

//available routes
app.use(express.json())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/matches', require('./routes/matches'))
app.use('/api/allmatches', require('./routes/allmatches'))
if(process.env.NODE_ENV == 'production'){
  app.use(express.static("client/build"))
}
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
