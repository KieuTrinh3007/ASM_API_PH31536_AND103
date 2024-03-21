const express = require('express');
const port = 3000;
const app = express();

const mongoose = require('mongoose');
const COMMON = require('./COMMON');
const multer = require('multer');
const fs = require('fs');

const uri = COMMON.uri;
const svModel = require('./studentModel');
const apiMobile = require('./api');

// Kết nối MongoDB khi ứng dụng bắt đầu
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Sử dụng router 'apiMobile' cho endpoint '/api'

app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use('/api', apiMobile);

app.use(express.static("uploads"));




app.get('/', async (req, res) => {
    try {
        const sinhViens = await svModel.find();
        res.send(sinhViens);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// liên kết đến trang upload.html
app.get('/image', (req, res) => {
    res.sendFile(__dirname + '/upload.html');
});


// upload ảnh

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var dir = './uploads';

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        let fileName = file.originalname;
        let newFileName = fileName;

        cb(null, newFileName);
    }

})

const upload = multer({ storage: storage });
app.post('/uploadfile', upload.single('avatar'), (req, res, next) => {
    let file = req.file;
    if (!file) {
        let error = new Error('Can chọn ảnh tải lên');
        error.httpStatusCode = 400;
        return next(error);
    }
    res.send(file)
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});

module.exports = app;
