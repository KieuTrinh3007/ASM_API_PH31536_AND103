const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const svModel = require('./model/FruitModel');
const upload = require('./config/common/upload')
const users = require('./model/userModel');


router.get('/', async (req, res) => {

    res.send('api mobile');
})

router.get('/list', async (req, res) => {
    let fruits = await svModel.find();
    res.send(fruits);
})

router.post('/add_sv', upload.single('avatar'), async (req, res) => {
    try {
        const data = req.body;
        const { file } = req
        const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`

        const newStudent = new svModel({
            ten: data.ten,
            soLuong: data.soLuong,
            gia: data.gia,
            avatar: imageUrl
        })

        const result = await newStudent.save()

        if (result) {
            res.json({
                "status": "200",
                "messenger": "Thêm thành công",
                "data": result,
            });
        } else {
            res.json({
                "status": "400",
                "messenger": "Lỗi, thêm không thành công",
                "data": [],
            });
        }
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error);
        res.status(500).send('Lỗi máy chủ nội bộ');
    }
});

// delete student
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    const result = await svModel.deleteOne({ _id: id });
    if (result) {
        res.json({
            "status": "200",
            "messenger": "Delete student success",
            "data": result
        })
    } else {
        res.json({
            "status": "400",
            "messenger": "Delete fail",
            "data": []
        })
    }
});

// update student
router.put('/update/:id', upload.single('avatar'), async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const { file } = req
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`

    const result = await svModel.findByIdAndUpdate(id, {
        ten: data.ten,
        soLuong: data.soLuong,
        gia: data.gia,
        avatar: imageUrl,
    })

    if (result) {
        res.json({
            "status": "200",
            "messenger": "Update student success",
            "data": result
        })
    } else {
        res.json({
            "status": "400",
            "messenger": "Update fail",
            "data": []
        })
    }

})

router.put('/update-no-image/:id', upload.single('avatar'), async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;

        const result = await svModel.findByIdAndUpdate(id, {
            ten: data.ten,
            soLuong: data.soLuong,
            gia: data.gia,
        })

        if (result) {
            res.json({
                "status": 200,
                "message": "Cập nhật thành công",
                "data": result
            });
        } else {
            res.json({
                "status": 400,
                "message": "Cap nhat that bai",
                "data": []
            });
        }
    } catch (error) {
        console.error('Lỗi khi thêm dữ liệu:', error);
        res.status(500).send('Đã xảy ra lỗi khi thêm dữ liệu');
    }
});

router.post('/register', upload.single('avatar'), async (req, res) => {
    try {
        const data = req.body;
        const { file } = req
        const avatar = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
        const newUser = users({
            username: data.username,
            password: data.password,
            email: data.email,
            name: data.name,
            avatar: avatar,
        })

        const result = await newUser.save()

        if (result) {
            res.json({
                "status": 200,
                "messenger": "Thêm thành công",
                "data": result
            })
        } else {
            res.json({
                "status": 400,
                "messenger": "Lỗi, thêm không thành công",
                "data": []
            })
        }
    } catch (error) {
        console.log(error);
    }
})

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await users.findOne({ username, password })
        if (user) {
            res.json({
                "status": 200,
                "messenger": "Đăng nhâp thành công",
                "data": user
            })
        } else {
            res.json({
                "status": 400,
                "messenger": "Lỗi, đăng nhập không thành công",
                "data": []
            })
        }
    } catch (error) {
        console.log(error);
    }
})

router.get('/search', async (req, res) => {
    try {
        const tuKhoa = req.query.key;

        const ketQuaTimKiem = await svModel.find({ ten: { $regex: new RegExp(tuKhoa, "i") } });

        if (ketQuaTimKiem.length > 0) {
            res.json(ketQuaTimKiem);
        } else {
            res.json([]);
        }
    } catch (error) {
        res.status(500).send('Lỗi máy chủ nội bộ');
    }
});

const sapxepgiamdan = (products) => {
    return products.sort((a, b) => b.gia - a.gia);
}

router.get('/giam-dan', async (req, res) => {
    try {
        let sv = await svModel.find();
        let sortedProducts = sapxepgiamdan(sv);
        res.json(sortedProducts);
    } catch (error) {
        console.error('Lỗi khi sắp xếp danh sách sản phẩm theo giá tăng dần:', error);
        res.status(500).send('Đã xảy ra lỗi khi sắp xếp danh sách sản phẩm');
    }
});

const sapxeptangdan = (products) => {
    return products.sort((a, b) => a.gia - b.gia);
}

router.get('/tang-dan', async (req, res) => {
    try {
        let sv = await svModel.find();
        let sortedProducts = sapxeptangdan(sv);
        res.json(sortedProducts);
    } catch (error) {
        console.error('Lỗi khi sắp xếp danh sách sản phẩm theo giá giảm dần:', error);
        res.status(500).send('Đã xảy ra lỗi khi sắp xếp danh sách sản phẩm');
    }
});



module.exports = router;