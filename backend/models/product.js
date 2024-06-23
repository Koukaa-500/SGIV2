const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  symbol: String,
  price: Number,
  change:Number,
  timestamp: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
