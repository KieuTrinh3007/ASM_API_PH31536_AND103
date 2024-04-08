const mongoose = require('mongoose');

const FruitSchema = mongoose.Schema({
    ten: {
        type: String,
        require: true
    },

    soLuong: {
        type: Number,
    },
    gia: {
        type: Number
    },

    avatar: {
        type: String
    }

});

const FruitModel = new mongoose.model ('fruits', FruitSchema)

module.exports = FruitModel;