const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
const app = express();
require('./config/connect');
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('./uploads')); // Serve static files from /uploads

// Routes
const AccountRoute = require('./routes/account');
const userRoute = require('./routes/user');
const productRoute = require('./routes/product');

app.use('/account', AccountRoute);
app.use('/user', userRoute);
app.use('/product', productRoute);

// HTTPS Server Configuration
// const options = {
//   key: fs.readFileSync('./key.pem'),
//   cert: fs.readFileSync('./cert.pem')
// };

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
