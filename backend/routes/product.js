const express = require('express');
const router = express.Router();
const Product = require('../models/product'); // Adjust path as needed
const profondeur = require('../models/profondeur');
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

  router.get('/profondeur/:symbol', async (req, res) => {
    try {
      const symbol = req.params.symbol;
      const profondeurs = await profondeur.find({ symbol }).sort({ date: -1 }); // Adjust sorting if needed
      if (!profondeurs.length) {
        return res.status(404).json({ error: 'No profondeur data found' });
      }
      res.json(profondeurs);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch profondeur data' });
    }
  });
  
  // POST route to add profondeur data
  router.post('/profondeur/:symbol', async (req, res) => {
    try {
      const symbol = req.params.symbol;
      const { sold, buy, qteA, qteV } = req.body;
      const newProfondeur = new profondeur({
        symbol,
        sold,
        buy,
        qteA,
        qteV
      });
      await newProfondeur.save();
      res.status(201).json(newProfondeur);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to add profondeur data' });
    }
  });

module.exports = router;
