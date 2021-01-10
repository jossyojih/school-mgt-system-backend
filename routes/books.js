const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const BookList = require('../models/bookList')
const requireLogin = require('../middleware/requireLogin')


router.post('/newbooklist',(req,res)=>{

    const {bookClass,book,total} = req.body
    
    const books = new BookList({
        bookClass,
        totalPrice:total,
        list:[...book]
       

    })
    books.save()
    .then(result=>{
        res.json({books:result})
    })
    .catch(err=>{
        console.log(err)
    })
})


router.get('/booklist/:class',(req,res)=>{
    BookList.find({bookClass:req.params.class})
    .then(book=>{
        res.json({book})
    })
    .catch(err=>{
        console.log(err)
    })
    
    })

    router.put('/booklist/:id',(req,res)=>{
        const {bookClass,book,total} = req.body
    const list = {
        bookClass,
        list:book,
        totalPrice:total
    }
     
        BookList.findByIdAndUpdate(req.params.id,list,{
            new:true
        })
        .then(result=>{
            res.json({result,message:'Booklist updated Successfully'})
        })
    
       .catch(err=>{
        console.log(err)
        })
    })  

module.exports = router