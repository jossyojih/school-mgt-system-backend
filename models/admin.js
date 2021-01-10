const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const adminSchema = new mongoose.Schema({
    name: { 
        first: {type: String, trim: true,required:true},
        last: { type: String, trim: true,required:true }
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
        default:true
    },
   
})
 

module.exports = mongoose.model("Admin", adminSchema);