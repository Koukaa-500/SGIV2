const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcryptjs'); // Changed from 'bcrypt' to 'bcryptjs'
const nodemailer = require('nodemailer');
const auth = require('./middleware');
const multer = require('multer');
///// User authentication 

//// Register
let filename = '';
const mystorage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
        let date = Date.now();
        let fl = date + '.' + file.mimetype.split('/')[1]; 
        callback(null, fl);
        filename = fl;
    }
});

const upload = multer({ storage: mystorage });

router.post('/register', upload.single('image'), async (req, res) => {
    try {
        const { name, email, password, phoneNumber } = req.body;
        const salt = bcrypt.genSaltSync(10);
        const cryptedPass = bcrypt.hashSync(password, salt);
        
        const user = new User({
            name,
            email,
            password: cryptedPass,
            phoneNumber,
            image: filename
        });

        const savedUser = await user.save();
        filename = '';
        res.status(200).send(savedUser);
    } catch (err) {
      console.log("erreur")
        res.status(400).send(err);
    }
});


///// Log in 
router.post('/login', async (req, res) => {
    try {
        const data = req.body;
        const user = await User.findOne({ email: data.email });
        if (!user) {
            return res.status(404).send('email or password invalid');
        }
        const validPassword = bcrypt.compareSync(data.password, user.password); // bcrypt.compareSync instead of await bcrypt.compareSync
        if (!validPassword) {
            return res.status(401).send('email or password invalid');
        }
        const payload = {
            _id: user._id,
            email: user.email,
            name: user.name
        };
        const token = jwt.sign(payload, '1234567'); // Payload contains data and '1234567' is the secret key to verify if token is valid or not
        res.status(200).send({ "mytoken": token });
        console.log("success");
    } catch (err) {
        res.status(500).send(err);
    }
});

//get User data
router.get('/get', auth, async (req, res) => {
    try {
      // req.user now contains the decoded user data from the token
      const user = await User.findById(req.user._id).select('-password');
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Respond with user data
      res.json({
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        image: user.image

      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

//get Image 
router.get('/get-image/:userId', auth, async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user || !user.image) {
      return res.status(404).json({ message: 'User or image not found' });
    }

    const imagePath = `http://localhost:3000/uploads/${user.image}`;
    res.json({ imagePath });
  } catch (error) {
    console.error('Error fetching user image:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to update user profile
router.put('/update', auth, async (req, res) => {
  try {
      const { name, email, phoneNumber } = req.body;
      
      // Find the user by ID
      const user = await User.findById(req.user._id);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Update user information
      user.name = name;
      user.email = email;
      user.phoneNumber = phoneNumber;
      if (filename) {
          user.image = filename;
          filename = ''; // Reset filename after use
      }

      // Save updated user
      const updatedUser = await user.save();

      res.status(200).json(updatedUser);
  } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ message: 'Server error' });
  }
});

//forget password 
router.post('/forget', auth, async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Find the user by ID
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the old password is correct
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New passwords do not match' });
    }

    // Hash the new password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Save updated user
    await user.save();

    res.status(200).json({ message: 'Password has been updated' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/favorite', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favoriteStocks');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.favoriteStocks);
  } catch (error) {
    console.error('Error fetching favorite stocks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/favorite1', auth, async (req, res) => {
  try {
    const { stockId, isFavorite } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (isFavorite) {
      if (!user.favoriteStocks.includes(stockId)) {
        user.favoriteStocks.push(stockId);
      }
    } else {
      user.favoriteStocks = user.favoriteStocks.filter(id => id !== stockId);
    }

    await user.save();
    res.status(200).json({ message: 'Favorite stocks updated successfully' });
  } catch (error) {
    console.error('Error updating favorite stocks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



  

module.exports = router;
