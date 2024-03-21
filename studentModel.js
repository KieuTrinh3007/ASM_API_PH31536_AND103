const mongoose = require('mongoose');

const StudentSchema = mongoose.Schema({
    tenSV: {
        type: String,
        require: true
    },

    maSV: {
        type: String,
        require: true
    },
    diemTB: {
        type: Number
    },

    avatar: {
        type: String
    }

});

const StudentModel = new mongoose.model ('students', StudentSchema)

module.exports = StudentModel;