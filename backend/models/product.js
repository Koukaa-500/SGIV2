const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  symbol: String,
  price: {
    type: Number,
    get: v => parseFloat(v).toFixed(2) // Format price to 2 decimal places
  },
  change: Number,
  quantity: Number,
  timestamp: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
