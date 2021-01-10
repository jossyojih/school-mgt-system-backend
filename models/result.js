const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const resultSchema = new mongoose.Schema({
   year:{
    type:Number,
   },
   term:{
    type:Number,
   },
    scores:[],
    class:{
        type:String
    },
    total:{
        type:Number,
        default:0
    },
    average:{
        type:Number,
        default:0
        
    },
    grade:{
        type:String
    },
     scale:{
        type:String
    },
    studentDetails:{
        type:ObjectId,
        ref:'Student'
    }
},{
    timestamps: true
})

module.exports = mongoose.model("Result", resultSchema);