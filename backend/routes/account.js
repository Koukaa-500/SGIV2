const express = require('express');
const router = express.Router();
const User = require('../models/user');
const auth = require('./middleware');

// Add a new account to a user
router.post('/add-account', auth, async (req, res) => {
    try {
        const { name, solde } = req.body;
        if (!name || !solde) {
            return res.status(400).json({ message: 'Name and solde are required' });
        }
        
        // Find the user by ID
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a new account object with an explicitly empty stock array
        const newAccount = {
            name,
            solde,
            stock: []  // Ensure stock is initialized as an empty array
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
router.post('/buy-stock', auth, async (req, res) => {
    try {
        const { accountId, stockData, quantity } = req.body;
        if (!accountId || !stockData || !quantity) {
            return res.status(400).json({ message: 'Account ID, stock data, and quantity are required' });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const account = user.accounts.id(accountId);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        const totalCost = stockData.price * quantity;
        if (account.solde < totalCost) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        const newStock = {
            name: stockData.name,
            quantity,
            price: stockData.price,
            symbol: stockData.symbol,
            type: stockData.type,
            validity: stockData.validity
        };

        account.stock.push(newStock);
        account.solde -= totalCost;

        await user.save();
        res.status(200).json({ message: 'Stock purchased successfully', account });
    } catch (error) {
        console.error('Error buying stock:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.post('/sell-stock', auth, async (req, res) => {
    try {
        const { accountId, stockData, quantity } = req.body;
        if (!accountId || !stockData || !quantity) {
            return res.status(400).json({ message: 'Account ID, stock data, and quantity are required' });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const account = user.accounts.id(accountId);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        const stock = account.stock.find(s => s.symbol === stockData.symbol);
        if (!stock || stock.quantity < quantity) {
            return res.status(400).json({ message: 'Insufficient stock quantity' });
        }

        stock.quantity -= quantity;
        if (stock.quantity === 0) {
            account.stock = account.stock.filter(s => s.symbol !== stockData.symbol);
        }

        account.solde += stockData.price * quantity;

        await user.save();
        res.status(200).json({ message: 'Stock sold successfully', account });
    } catch (error) {
        console.error('Error selling stock:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
module.exports = router;
