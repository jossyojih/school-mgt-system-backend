const mongoose = require('mongoose')
const schoolyr = new Date().getFullYear()
const schoolCalendarSchema = new mongoose.Schema({
    year:{
        type:Number,
        'default': schoolyr
    },
    term:{
        type:Number,
        required:true
    },
    week:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model("SchoolCalendar", schoolCalendarSchema);