const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const mth = new Date().getMonth()
const staffAttendanceSchema = new mongoose.Schema({
    year:{
        type:Number,
       },
       term:{
        type:Number,
       },
       month:{
        type:Number,
        'default': (mth+1)
       },
       week:{
        type:String,
       },
       date:{
        type:String,
       },
    status:{
    type:String,
   },
   signIn:{
    timestamp: { type: Date  }
   },
   signOut:{
    timestamp: { type: Date}
   },
   staffDetails:{
    type:ObjectId,
    ref:'Staff'
},
},{
    timestamps: true
})

module.exports = mongoose.model("StaffAttendance", staffAttendanceSchema);