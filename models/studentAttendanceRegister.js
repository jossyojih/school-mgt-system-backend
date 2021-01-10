const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const attendanceRegisterSchema = new mongoose.Schema({
    year:{
        type:Number,
       },
       term:{
        type:Number,
       },
       week:{
        type:String,
       },
       date:{
        type:String,
       },
    section:{
        type:String,
        required:true
    },
    stdClass:{
        type:String,
        required:true
    },

    status:{
    type:String,
   },
   studentDetails:{
    type:ObjectId,
    ref:'Student'
},
},{
    timestamps: true
})

module.exports = mongoose.model("AttendanceRegister", attendanceRegisterSchema);