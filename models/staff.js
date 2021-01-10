const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const staffSchema = new mongoose.Schema({
    name: { 
        first: {type: String, trim: true,required:true},
        middle: {type: String, trim: true},
        last: { type: String, trim: true,required:true }
    },
    sex:{type:String,
        required:true
    },
    DOB:{
        type: Date,
       // required:true
    },
    position:{
        type:String
    },
    classMaster:{
        type:String,
    },
    stateOfOrigin:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        default:"123456789"
    },
    photo:{
        type:String,
        default:"https://res.cloudinary.com/jossyjoe/image/upload/v1606258324/UserIcon_tmu1v6.jpg"
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    maritalStatus:{
        type:String,
    },
    salary:{
        type:String,
    },
    calendar:{
        type:ObjectId,ref:"SchoolCalendar"
    },
   
    students:[{type:ObjectId,ref:"Student"}],
   
})

    staffSchema.virtual("fullName").get(function() {
        return `${this.name.first} ${this.name.last}`;
    }); 


module.exports = mongoose.model("Staff", staffSchema);