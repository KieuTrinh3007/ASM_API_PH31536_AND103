const express = require('express');
const port = 3000;
const app = express();
const mongoose = require('mongoose');

const svModel = require('./model/FruitModel');

const path = require('path');



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});

const uri = 'mongodb+srv://trinhpkph31536:nhokgl9x@cluster0.gwfgczu.mongodb.net/ASM_AND103';// ten project o cuoi

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

const api = require('./api');
app.use('/api', api)


// Kết nối MongoDB khi ứng dụng bắt đầu
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Sử dụng router 'apiMobile' cho endpoint '/api'

try {
    mongoose.connect(uri)
    console.log('Ket noi thanh cong');
} catch (error) {
    console.log('Loi: ', error);
}


app.get('/', async (req, res) => {
    try {
        const fruits = await svModel.find();
        res.send(fruits);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});






module.exports = app;
