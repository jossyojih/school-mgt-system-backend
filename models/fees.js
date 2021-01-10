const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const feesSchema = new mongoose.Schema({
    section:{
        type:String,
        
    },
    stdClass:{
        type:String
    },
    year:{
        type:Number,
    },
    term:{
        type:Number,
    },
    schoolFees:{
        amount: {type: Number},
        paid: {type: Number},
        remark: {type: String},

    },
    uniform_otherwears:{
        amount: {type: Number},
        paid: {type: Number},
        remark: {type: String},
    },
    examFees:{
        amount: {type: Number},
        paid: {type: Number},
        remark: {type: String},
    },
    excursion:{
        amount: {type: Number},
        paid: {type: Number},
        remark: {type: String},
    },
    books:{
        amount: {type: Number},
        paid: {type: Number},
        remark: {type: String},
    },
    transportation:{
        amount: {type: Number},
        paid: {type: Number},
        remark: {type: String},
    },
     studentDetails:{
        type:ObjectId,
        ref:'Student'
    }
},{
    timestamps: true
})

module.exports = mongoose.model("Fees", feesSchema);