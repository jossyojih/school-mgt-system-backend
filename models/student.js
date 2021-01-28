const mongoose = require('mongoose')
const Subject= require('./subjects')
const {ObjectId} = mongoose.Schema.Types
const { Schema } = mongoose;

const studentSchema = new mongoose.Schema({
    name: {type: Schema.Types.Mixed, required: true},
    sex:{type:String,
        required:true
    },
    DOB:{
        type: Date,
       // required:true
    },
    section:{
        type:String,
        required:true
    },
    stdClass:{
        type:String,
        required:true
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
    parentName:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        default:"123456789"
    },
    occupation:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        default:"https://res.cloudinary.com/jossyjoe/image/upload/v1606258324/UserIcon_tmu1v6.jpg"
    },
    calendar:{
        type:ObjectId,ref:"SchoolCalendar"
    },
    bookList:[],
    notification:[{
        sender:{type:ObjectId,ref:"User"},
        timestamp:{type:String},
        notice:{type:String},
    }],
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}]
})

studentSchema.virtual("fullName").get(function() {
    return `${this.name.first} ${this.name.last}`;
    }); 
/*
    studentSchema.pre("save", function (next) { 
        let student = this; 
        if (student.scores[0] === undefined) { 
            
        Subject.findOne({
        section: student.section
        }) 
        .then(subjects => {
            const value = subjects.subjects
        const result = value.map(val=>{
            return  {
            subject:val,
            test:0,
            exam:0,
            total:0
        }
       })
       
        student.scores.scores= result; 
            next();
        })
        .catch(error => {
        console.log(`Error in connecting subscriber:
       ${error.message}`);
        next(error); 
        });
        } else {
        next(); 
        }
     
       });
*/

module.exports = mongoose.model("Student", studentSchema);