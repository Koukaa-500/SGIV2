const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    message: {
        type: String,
    },
    date: {
        type: Date,
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
        type: Number,
        get: v => parseFloat(v).toFixed(2) // Format price to 2 decimal places
      },
    symbol: {
        type: String,
    },
    type: {
        type: String,
    },
    validity: {
        type: String,
    }
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
    solde: {
        type: Number,
        get: v => parseFloat(v).toFixed(2) // Format price to 2 decimal places
      },
});

const notificationSchema = new mongoose.Schema({
    message: {
        type: String,
    },
    date: {
        type: Date,
    },
    isRead: { type: Boolean, default: false }
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
