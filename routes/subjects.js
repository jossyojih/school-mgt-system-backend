const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Subject = require('../models/subjects')
const requireLogin = require('../middleware/requireLogin')
const staffLogin = require('../middleware/staffLogin')


router.post('/admin/newsubjectList',staffLogin,(req,res)=>{

    const {section,subjects} = req.body
    if(!section||!subjects){
        return res.status(422).json({error:'please add all the fields'})
    }
    Subject.findOne({section:section})
    .then((savedsection)=>{
        if(savedsection){
            return res.status(422).json({error:"Subjects for ths Section Already Exists",result:savedsection})
        }
    
    //if(!title||!body||!imgUrl){
      //  return res.status(422).json({error:'Please add all the fields'})
   // }
   // req.user.password = undefined
    const subject = new Subject({
        section,
        subjects
       // photo:imgUrl,
      //  postedBy:req.user

    })
    subject.save()
    .then(result=>{
        res.json({subject:result})
    })
    .catch(err=>{
        console.log(err)
    })
}).catch(err=>{
    console.log(err)
})
})

module.exports = router