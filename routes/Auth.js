const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Student = require('../models/student')
const Staff = require('../models/staff')
const Admin = require('../models/admin.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Calendar = require('../models/schoolCalendar')
const requireLogin = require('../middleware/requireLogin')


//Registration for New Student
router.post('/student/register',(req,res)=>{
    const {firstName,lastName,middleName,parentName,DOB,email,password,imgUrl,state,stdClass,phone,occupation,sex,section} = req.body;
    if(!email||!password||!firstName||!lastName||!state||!sex||!section){
        return res.status(422).json({error:'please add all the fields'})
    }
 
    Student.findOne({email:email})
    .then((savedstudent)=>{
        if(savedstudent){
            return res.status(422).json({error:"A student with this email already exists"})
        }
        bcrypt.hash(password,12)
            .then(hashedPassword=>{

            Calendar.findOne() 
                    .then(data=>{
            const student = new Student({
                 calendar:data._id,
                email,
                password:hashedPassword,
                name:{
                    first:firstName,
                    middle:middleName,
                    last:lastName
                },
                parentName,
                occupation,
                phone,
                stateOfOrigin:state,
                sex,
                DOB,
                stdClass,
                photo:imgUrl,
                section
            })
            student.save()
            .then(student=>{
                res.json({message:'student saved Successfully'})
            })
            .catch(err=>{
                console.log(err)
            })
        })
       
    })
    .catch(err=>{
        console.log(err)
    })
    })
    .catch(err=>{
        console.log(err)
    })
    
})

//Student Signin
router.post('/student/signin',(req,res)=>{
  
    const {email,password,phone} = req.body;
    if((!email&&!phone)||!password){
       return res.status(422).json({error:'please add email or password'})
    }
    if(email){
        Student.findOne({email:email})
        .populate('calendar', 'year term week')
        .then(savedstudent=>{
            if(!savedstudent){
               return res.status(422).json({error:'Invalid email or password'})
            }
            bcrypt.compare(password,savedstudent.password)
            .then(doMatch=>{
                if(doMatch){
                    //res.json({message:'Successfully Signed In'})
                    const token = jwt.sign({_id:savedstudent._id},process.env.jwt)
                    
                    const {_id,name,email,photo,section,DOB,stdClass,sex,stateOfOrigin,parentName,occupation,phone,calendar}=savedstudent
                    res.json({token,student:{_id,name,email,photo,section,DOB,stdClass,sex,stateOfOrigin,parentName,occupation,phone,calendar}})
                }else{
                    return res.status(422).json({error:'Invalid Email or password'})
                }
            }) .catch(err=>{
                console.log(err)
            })
        })
        .catch(err=>{
            console.log(err)
        })
    }else if(phone){

    Student.findOne({phone:phone})
    .populate('calendar', 'year term week')
    .then(savedstudent=>{
        if(!savedstudent){
           return res.status(422).json({error:'Invalid email or password'})
        }
        bcrypt.compare(password,savedstudent.password)
        .then(doMatch=>{
            if(doMatch){
                //res.json({message:'Successfully Signed In'})
                const token = jwt.sign({_id:savedstudent._id},process.env.jwt)
                const {_id,name,email,photo,section,DOB,stdClass,sex,stateOfOrigin,parentName,occupation,phone,calendar}=savedstudent
                res.json({token,student:{_id,name,email,photo,section,DOB,stdClass,sex,stateOfOrigin,parentName,occupation,phone,calendar}})
            }else{
                return res.status(422).json({error:'Invalid Email or password'})
            }
        }) .catch(err=>{
            console.log(err)
        })
    })
    .catch(err=>{
        console.log(err)
    })
}
})

//Staff Signin
router.post('/staff/signin',(req,res)=>{
    
    const {email,password,phone} = req.body;
    if((!email&&!phone)||!password){
       return res.status(422).json({error:'please add email or password'})
    }
    if(email){
        Staff.findOne({email:email})
        .then(savedstaff=>{
            if(!savedstaff){
               return res.status(422).json({error:'Invalid email or password'})
            }
            bcrypt.compare(password,savedstaff.password)
            .then(doMatch=>{
                if(doMatch){
                    //res.json({message:'Successfully Signed In'})
                    const token = jwt.sign({_id:savedstaff._id},process.env.jwt)
                    const {_id,name,email,isAdmin,isStaff,photo}=savedstaff
                    res.json({token,staff:{_id, name,email,isAdmin,isStaff,photo}})
                }else{
                    return res.status(422).json({error:'Invalid Email or password'})
                }
            }) .catch(err=>{
                console.log(err)
            })
        })
        .catch(err=>{
            console.log(err)
        })
    }else if(phone){

    Staff.findOne({phone:phone})
    .then(savedstaff=>{
        if(!savedstaff){
           return res.status(422).json({error:'Invalid email or password'})
        }
        bcrypt.compare(password,savedstaff.password)
        .then(doMatch=>{
            if(doMatch){
                //res.json({message:'Successfully Signed In'})
                const token = jwt.sign({_id:savedstaff._id},process.env.jwt)
                const {_id,name,email,isAdmin,isStaff,photo}=savedstaff
                res.json({token,staff:{_id, name,email,isAdmin,isStaff,photo}})
            }else{
                return res.status(422).json({error:'Invalid Email or password'})
            }
        }) .catch(err=>{
            console.log(err)
        })
    })
    .catch(err=>{
        console.log(err)
    })
}
})

//Registration for a new staff

router.post('/staff/register',(req,res)=>{
   
    const {firstName,lastName,middleName,DOB,email,password,imgUrl,state,classMaster,phone,sex,maritalStatus} = req.body;
    if(!email||!password||!firstName||!lastName||!state||!sex||!phone){
        return res.status(422).json({error:'please add all the fields'})
    }
 
    Staff.findOne({email:email})
    .then((savedstaff)=>{
        if(savedstaff){
            return res.status(422).json({error:"A staff with this email already exists"})
        }
        bcrypt.hash(password,12)
        .then(hashedPassword=>{
            
            Calendar.findOne() 
            .then(data=>{
                const staff = new Staff({
                calendar:data._id,
                email,
                password:hashedPassword,
                name:{
                    first:firstName,
                    middle:middleName,
                    last:lastName
                },
                phone,
                stateOfOrigin:state,
                sex,
                DOB,
                maritalStatus,
                classMaster,
                photo:imgUrl,
                
            }) 
             staff.save()
            .then(staff=>{
                res.json({message:'staff saved Successfully'})
            })
            .catch(err=>{
                console.log(err)
            })
        })
           
        })
        .catch(err=>{
            console.log(err)
        })
       
      
    })
    .catch(err=>{
        console.log(err)
    })
    
})

//Registration for Main Admin

router.post('/admin',(req,res)=>{
    
    const {firstName,lastName,email,password,phone} = req.body;
    if(!email||!password||!firstName||!lastName||!phone){
        return res.status(422).json({error:'please add all the fields'})
    }
 
    Admin.findOne({email:email})
    .then((savedadmin)=>{
        if(savedadmin){
            return res.status(422).json({error:"An admin with this email already exists"})
        }
        bcrypt.hash(password,12)
        .then(hashedPassword=>{
            const admin = new Admin({
                email,
                password:hashedPassword,
                name:{
                    first:firstName,
                    last:lastName
                },
                phone
                
            })
            admin.save()
            .then(admin=>{
                res.json({message:'admin saved Successfully'})
            })
            .catch(err=>{
                console.log(err)
            })
        })
       
      
    })
    .catch(err=>{
        console.log(err)
    })
    
})


//Admin Signin
router.post('/admin/signin',(req,res)=>{
   
    const {email,password,phone} = req.body;
    if((!email&&!phone)||!password){
       return res.status(422).json({error:'please add email or password'})
    }
    if(email){
        Admin.findOne({email:email})
        .then(savedadmin=>{
            if(!savedadmin){
               return res.status(422).json({error:'Invalid email or password'})
            }
            bcrypt.compare(password,savedadmin.password)
            .then(doMatch=>{
                if(doMatch){
                    //res.json({message:'Successfully Signed In'})
                    const token = jwt.sign({_id:savedadmin._id},process.env.jwt)
                    const {_id,name,email,photo,isAdmin}=savedadmin
                    res.json({token,admin:{_id, name,email,photo,isAdmin}})
                }else{
                    return res.status(422).json({error:'Invalid Email or password'})
                }
            }) .catch(err=>{
                console.log(err)
            })
        })
        .catch(err=>{
            console.log(err)
        })
    }else if(phone){

    Admin.findOne({phone:phone})
    .then(savedadmin=>{
        if(!savedadmin){
           return res.status(422).json({error:'Invalid email or password'})
        }
        bcrypt.compare(password,savedadmin.password)
        .then(doMatch=>{
            if(doMatch){
                //res.json({message:'Successfully Signed In'})
                const token = jwt.sign({_id:savedadmin._id},process.env.jwt)
                const {_id,name,email,isAdmin,photo}=savedadmin
                res.json({token,admin:{_id, name,email,photo,isAdmin}})
            }else{
                return res.status(422).json({error:'Invalid Email or password'})
            }
        }) .catch(err=>{
            console.log(err)
        })
    })
    .catch(err=>{
        console.log(err)
    })
}
})

module.exports = router