const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan')

const app = express();

const port = process.env.PORT ? process.env.PORT : "3000";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});



const CarModel = require('./models/cars');

app.use(express.urlencoded({ extended: true })); // To parse form data
app.use(methodOverride('_method'));
app.use(morgan('dev'))

app.get('/', function(req, res){
    res.render("index.ejs"); 
});

app.get('/car', async function(req, res){
    const cars = await CarModel.find();
    cars.forEach(car => {
        console.log(`ID: ${car._id}, Name: ${car.name}`);
    });

    res.render('cars/car.ejs', { cars }); 
});

app.get('/car/new', function(req, res){
    res.render('cars/car-form.ejs'); 
});

app.post('/cars', async function(req, res){
    req.body.isElectric = req.body.isElectric === 'on'; 
    const newCar = new CarModel(req.body);
    await newCar.save();
    res.redirect('/car'); 
});

app.get('/car/id/:name', async function(req, res){
      const car = await CarModel.findOne({ name: req.params.name }); 
      res.send(car._id);
});

app.get('/car/:id/edit', async function(req, res){
      const car = await CarModel.findById(req.params.id);
      res.render('cars/car-edit.ejs', { car });
});

app.get('/car/:id', async function(req, res){
      const car = await CarModel.findById(req.params.id);
      res.render('cars/car-show.ejs', { car });
});

app.put('/car/:id', async function(req, res){
    req.body.isElectric = req.body.isElectric === 'true'; 

    const updatedCar = await CarModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.redirect('/car'); 
});

app.delete('/car/:id', async (req, res) => {
        await CarModel.findByIdAndDelete(req.params.id);
        res.redirect('/car'); 
});

app.listen(3000, function(){
    console.log('express server is listening for request on port:3000')
})