const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    symbol: {
      type: String, // Stock symbol or order identifier
    },
    price: {
      type: Number, // Price of the stock
    },
    quantityOrdered: {
      type: Number, // Quantity of stocks ordered
    },
    status: {
      type: String, // Status of the order
    },
    orderType: {
      type: String, // Type of the order (buy/sell)
    },
    date: {
      type: Date, // Date of the order
    }
  });
  



const productSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    quantity: {
        type: Number,
    },
    price: {
        type: Number
         // Format price to 2 decimal places
      },
    symbol: {
        type: String,
    },
    type: {
        type: String,
    },
    validity: {
        type: String,
    },
    date: {
        type: Date,
    },
    change:Number
});

const accountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    stock: {
        type: [productSchema],
        default: () => []
    },
    solde: { type: Number, required: true }
});

const notificationSchema = new mongoose.Schema({
    message: {
        type: String,
    },
    date: {
        type: Date,
    },
    isRead: { type: Boolean, default: false },
    color: {type:String}
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    image: {
        type: String
    },
    accounts: [accountSchema],
    favoriteStocks: [String],
    notifications: [notificationSchema],
    history: [historySchema],
    
});

const User = mongoose.model('User', userSchema);

module.exports = User;
