const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const staffDutySchema = new mongoose.Schema({
    week:{
        type:String,
        required:true
    },
    term:{
        type:ObjectId,ref:"SchoolCalendar"
    },
    week:{
        type:String,
        required:true
    },
    duty:{
        type:String,
        required:true
    },
    startDate:{
        type: Date,
    },
    endDate:{
        type: Date,
    },
    staffs:[]
  
})

module.exports = mongoose.model("StaffDuty", staffDutySchema);