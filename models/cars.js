// models/fruit.js

const mongoose = require("mongoose");


const carSchema = new mongoose.Schema({
    name: String,
    brand: String,
    year: Number,
    isElectric: Boolean,
});

const CarModel = mongoose.model('Cars', carSchema)

module.exports = CarModel