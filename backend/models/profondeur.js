const mongoose = require('mongoose');

const profondeurSchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true
    },
    sold: {
        type: Number,
        get: v => parseFloat(v).toFixed(2) // Format price to 2 decimal places
      },
    buy: {
        type: Number,
        get: v => parseFloat(v).toFixed(2) // Format price to 2 decimal places
      },
    qteA : Number,
    qteV : Number
})
const profondeur = mongoose.model('profondeur', profondeurSchema);
module.exports = profondeur;