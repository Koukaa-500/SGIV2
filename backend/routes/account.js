const express = require('express');
const router = express.Router();
const User = require('../models/user');
const auth = require('./middleware');

// Add a new account to a user
router.post('/add-account', auth, async (req, res) => {
    try {
        const { name, stock, solde } = req.body;
        if (!name || !stock || !solde) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        console.log(req.user);
        // Find the user by ID
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a new account object
        const newAccount = {
            name,
            stock,
            solde
        };

        // Add the new account to the user's accounts array
        user.accounts.push(newAccount);

        // Save the updated user
        const updatedUser = await user.save();

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error adding account:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.get('/accounts', auth, async (req, res) => {
    try {
        // Find the user by ID
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the user's accounts
        res.status(200).json({ accounts: user.accounts });
    } catch (error) {
        console.error('Error fetching accounts:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
