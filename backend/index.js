const express = require('express');
const cors = require('cors'); // Import the cors middleware
const app = express();
const bodyParser = require('body-parser');
require('./config/connect');
const nodemailer = require('nodemailer');
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON bodies

// Your routes go here
const userRoute = require('./routes/user');
app.use('/user', userRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
