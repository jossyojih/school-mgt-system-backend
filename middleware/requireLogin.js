const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const Student = require('../models/student')

module.exports = (req,res,next)=>{
  
    const {authorization} = req.headers
   
    if(!authorization){
  return res.status(401).json({error:'You must be logged in'})
    }
   const token = authorization.replace('Bearer ',"")
    jwt.verify(token,process.env.jwt,(err,payload)=>{
        if(err){
           return res.status(401).json({error:'You must be logged in'})
        }

        const {_id} = payload
        Student.findById(_id)
        .then(studentdata=>{
            req.student = studentdata
            next()
        })
        
    })
}