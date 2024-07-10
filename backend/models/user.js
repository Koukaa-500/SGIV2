const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    quantity: {
        type: Number,
    },
    price: {
        type: Number,
    },
    symbol: {
        type: String, // Adding symbol field
    },
    type: {
        type: String, // Adding type field
    },
    validity: {
        type: String, // Adding validity field
    }
});

const accountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    stock: {
        type: [productSchema],
        default: () => []  // Initialize an empty array by default
    },
    solde: {
        type: Number,
        required: true
    }
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
    favoriteStocks: [String], // Store symbols instead of ObjectId references
    notifications: [String]  // Adding notifications field as an array of strings

});

const User = mongoose.model('User', userSchema);

module.exports = User;
