const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const svModel = require('./studentModel'); 
const COMMON = require('./COMMON');
const uri = COMMON.uri;

router.get('/', async (req,res) => {
   
    res.send('api mobile');
})

router.get('/list', async (req,res) => {
    await mongoose.connect(uri);
    let sinhViens = await svModel.find();
    console.log(sinhViens);
    res.send(sinhViens);
})

router.post('/add_sv', async (req,res) => {
    await mongoose.connect(uri);
    try {
        const data = req.body;
        console.log("abc =======",req.body);

        const newStudent = new svModel({
            tenSV: data.tenSV,
            maSV: data.maSV,
            diemTB: data.diemTB,
            avatar: data.avatar
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
router.delete('/delete/:id', async (req,res) => {
    const {id} = req.params;
    const result = await svModel.deleteOne({_id:id});
    if(result){
        res.json({
            "status" : "200",
            "messenger" : "Delete student success",
            "data" : result
        })
    }else{
        res.json({
            "status" : "400",
            "messenger" : "Delete fail",
            "data" : []
        })
    }
});

// update student
router.put('/update/:id', async (req,res) => {
    const {id} = req.params;
    const data = req.body;
    const UpdateStudent = await svModel.findById(id);
    let result = null;
    if(UpdateStudent){
        UpdateStudent.tenSV = data.tenSV ?? UpdateStudent.tenSV;
        UpdateStudent.maSV = data.maSV ?? UpdateStudent.maSV;
        UpdateStudent.diemTB = data.diemTB ?? UpdateStudent.diemTB;
        UpdateStudent.avatar = data.avatar ?? UpdateStudent.avatar;
        result = await UpdateStudent.save();
    }

    if(result){
        res.json({
            "status" : "200",
            "messenger" : "Update student success",
            "data" : result
        })
    }else{
        res.json({
            "status" : "400",
            "messenger" : "Update fail",
            "data" : []
        })
    }
    
})
module.exports = router;