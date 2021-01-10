const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const Staff = require('../models/staff')

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
        Staff.findById(_id)
        .then(staffdata=>{
            req.staff = staffdata
            next()
        })
        
    })
}