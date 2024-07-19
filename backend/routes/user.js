const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcryptjs'); // Changed from 'bcrypt' to 'bcryptjs'
const nodemailer = require('nodemailer');
const auth = require('./middleware');
const multer = require('multer');
const cron = require('node-cron');

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
// Add this in your existing router file
router.get('/notifications', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('notifications');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/notifications1', auth, async (req, res) => {
  try {
    const userId = req.user._id; // Extract user ID from the token
    const { message } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const notification = {
      message,
      date: new Date()
    };

    user.notifications.push(notification);
    await user.save();

    res.status(200).json({ message: 'Notification added successfully' });
  } catch (error) {
    console.error('Error adding notification:', error);
    res.status(500).json({ message: 'Server error' });
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

    const imagePath = `http://192.168.56.1:3000/uploads/${user.image}`;
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

const addNotification = async (message) => {
  try {
    const users = await User.find({});
    users.forEach(async (user) => {
      const notification = {
        message,
        date: new Date()
      };
      user.notifications.push(notification);
      await user.save();
    });
  } catch (error) {
    console.error('Error adding notification:', error);
  }
};

// const addNotification = async (message) => {
//   try {
//     const users = await User.find({});
//     users.forEach(async (user) => {
//       user.notifications.push(message);
//       await user.save();
//     });
//   } catch (error) {
//     console.error('Error adding notification:', error);
//   }
// };

// Schedule tasks
cron.schedule('0 20 * * *', () => {
  // Runs every day at 8 PM
  addNotification("Stocks are closed.");
});

cron.schedule('0 6 * * *', () => {
  // Runs every day at 6 AM
  addNotification("Stocks are opened.");
});
  
router.get('/user-data', auth, async (req, res) => {
  try {
      const userId = req.user._id; // Extract user ID from the token

      const user = await User.findById(userId).populate({
          path: 'accounts.stock notifications'
      }).exec();

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(user);
  } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Server error' });
  }
});

// Route to post user history
router.post('/history1', auth, async (req, res) => {
  try {
    const userId = req.user._id; // Extract user ID from the token
    const { message } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const historyEntry = {
      message,
      date: new Date() // Initialize date server-side
    };

    user.history.push(historyEntry);
    await user.save();

    res.status(200).json({ message: 'History entry added successfully' });
  } catch (error) {
    console.error('Error adding history entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Route to get user history
router.get('/history', auth, async (req, res) => {
  try {
    const userId = req.user._id; // Extract user ID from the token
    const user = await User.findById(userId).select('history');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.history);
  } catch (error) {
    console.error('Error fetching user history:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/notifications/unread', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('notifications');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const unreadCount = user.notifications.filter(notification => !notification.isRead).length;
    res.status(200).json(unreadCount);
    console.log(res);
  } catch (error) {
    console.error('Error fetching unread notifications count:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/notifications/:id/read', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const notification = user.notifications.id(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.isRead = true; // Mark the notification as read
    await user.save();

    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
