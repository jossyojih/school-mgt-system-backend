const mongoose = require('mongoose')

const bookListSchema = new mongoose.Schema({
    bookClass:{
        type:String,
        required:true
    },
    list:[],
    totalPrice:{
        type:Number
    }
})

module.exports = mongoose.model("BookList", bookListSchema);