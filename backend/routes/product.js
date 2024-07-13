const express = require('express');
const router = express.Router();
const Product = require('../models/product'); // Adjust path as needed

// POST /product/stocks - Create a new stock product
router.post('/stocks', async (req, res) => {
  try {
    const { symbol, price,change,quantity } = req.body;
    const newStockPrice = new Product({ symbol, price,change,quantity });
    await newStockPrice.save();
    res.status(201).json({ message: 'Stock price saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save stock price' });
  }
});

router.get('/history/:symbol', async (req, res) => {
    try {
      const symbol = req.params.symbol;
      const history = await Product.find({ symbol }).sort({ timestamp: 1 });
      res.json(history);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch stock price history' });
    }
  });

module.exports = router;
