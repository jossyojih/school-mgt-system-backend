const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Student = require('../models/student')
const Staff = require('../models/staff')
const StaffAttendance = require('../models/staffAttendance')
const Result = require('../models/result')
const requireLogin = require('../middleware/requireLogin')
const staffLogin = require('../middleware/staffLogin')
const bcrypt = require('bcryptjs')
const Calendar = require('../models/schoolCalendar')
const StaffDuty = require('../models/staffDuty')
const result = require('../models/result')

//get All staff
router.get('/admin/stafflist',(req,res)=>{
    Staff.find()
    .then(staffs=>{
     // const students = student.slice(0, 5)
        res.json({staffs})
    })
    .catch(err=>{
        console.log(err)
    })
})
//Single Staff Details

router.get('/staff/:id',staffLogin,(req,res)=>{
    Staff.findOne({_id:req.params.id})
    .select("id section name DOB  sex stateOfOrigin position photo maritalStatus salary isAdmin phone")
    .populate('calendar',"_id year term")
    .then(staff=>{
        res.json({staff})
        })
    .catch(err=>{
        return res.status(404).json({error:"student not found"})
    })
})


//update Staff Photo

router.put('/staff/updatephoto/:id',requireLogin,(req,res)=>{
    Staff.findByIdAndUpdate(req.params.id,{
        $set:{photo:req.body.imgUrl}
    },{new:true})
    .select('-password')
    .then(result=>{
        res.json(result)
    })
    .catch(err=>{
        return res.status(422).json({error:'could not update photo'})
    })
   
})



//get single Staff term attendaance
router.get('/admin/stafftermattendance/:id',(req,res)=>{
    console.log(req.params.id)
    Calendar.findOne() 
    .then(data=>{
        StaffAttendance.find({staffDetails:req.params.id,term:data.term})
        .populate('staffDetails',"_id name sex position")
        .then(result=>{
           //const results = result.sort((a, b) =>a.createdAt < b.createdAt ? -1 : 1)
            res.json({result})
        })
        .catch(err=>{
            console.log(err)
        })
    })
    .catch(err=>{
        console.log(err)
    })
})


//get all staff attendaance for a given day
router.get('/admin/staffdailyattendance/:date',(req,res)=>{
  
   const {date} = req.params

        StaffAttendance.find({date})
        .populate('staffDetails',"_id name sex position")
        .then(result=>{
           //const results = result.sort((a, b) =>a.createdAt < b.createdAt ? -1 : 1)
            res.json({result})
        })
        .catch(err=>{
            console.log(err)
        })
        
    })
  


//Activate Staff attendance Register

router.post('/admin/activateattendanceregister',(req,res)=>{
    const today= new Date().toDateString()
    StaffAttendance.find({date:today})
    .then(data=>{
        if(data[0]===undefined){
            Staff.find()
            .select('-password')
            .populate('calendar',"_id year term week")
            .then(staffs=>{
               
                if(staffs[0]===undefined){
                    return res.status(422).json({error:'No Staff is registered yet'})
                }
             const  record =   staffs.map(staff=>{
        
                    const record = {
                        staffDetails:staff._id,
                        year:staff.calendar.year,
                        term:staff.calendar.term,
                        week:staff.calendar.week,
                        date:today,
                        status:'Absent'
                    }
                    return record
                })
               
                for (let i=0; i <record.length; i++){
                    const data = new StaffAttendance({
                        staffDetails:record[i].staffDetails,
                        year:record[i].year,
                        term:record[i].term,
                        week:record[i].week,
                        date:record[i].date,
                        status:record[i].status
                    })
                    data.save()
                    .then(result=>{
                        res.json({result,message:'Attendance Register Activated'})
                    })
                    .catch(err=>{
                        console.log(err)
                    })
                }
               
            })
            .catch(err=>{
                console.log(err)
            })
        }else{
            res.json({message:'Attendance Already Activated'})
        }
       
    })
    .catch(err=>{
        console.log(err)
    })
   
   
})
//staff Daily Login

router.put('/admin/staff/signin',(req,res)=>{
    
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
                    const today= new Date().toDateString()
                    StaffAttendance.findOne({staffDetails:savedstaff._id,date:today})
                    .then(staff=>{
                     
                        if(!staff){
                            return res.status(422).json({error:'Staff Attendance Has not been Activated Today'})
                        }
                        if(staff.status==="Present"){
                             return res.status(422).json({error:'Staff Is Already Logged In'})
                        }else{
                         StaffAttendance.findOneAndUpdate({staffDetails:savedstaff._id,date:today},{
                             status:"Present",
                             signIn:{
                                 timestamp: Date.now()
                             }
                         },{
                             new:true
                         })
                         .populate('staffDetails',"_id name sex maritalStatus")
                         .then(data=>{
                             res.json({data,message:'Staff Sign In Successfully'})
                         })
                     
                        .catch(err=>{
                         console.log(err)
                         })
                        }
                    })
                    .catch(err=>{
                        console.log(err)
                    })
                 
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
             
               const today= new Date().toDateString()
               StaffAttendance.findOne({staffDetails:savedstaff._id,date:today})
               .then(staff=>{
                if(!staff){
                    return res.status(422).json({error:'Staff Attendance Has not been Activated Today'})
                }
                   if(staff.status==="Present"){
                        return res.status(422).json({error:'Staff Is Already Logged In'})
                   }else{
                    StaffAttendance.findOneAndUpdate({staffDetails:savedstaff._id,date:today},{
                        status:"Present",
                        signIn:{
                            timestamp: Date.now()
                        }
                    },{
                        new:true
                    })
                    .populate('staffDetails',"_id name sex maritalStatus")
                    .then(data=>{
                        res.json({data,message:'Staff Sign In Successfully'})
                    })
                
                   .catch(err=>{
                    console.log(err)
                    })
                   }
               })
               .catch(err=>{
                   console.log(err)
               })
           
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

//staff Daily Logout
router.put('/admin/staff/signout',(req,res)=>{
    
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
                    const today= new Date().toDateString()
                    StaffAttendance.findOne({staffDetails:savedstaff._id,date:today})
                    .then(staff=>{
                     if(!staff){
                         return res.status(422).json({error:'Staff Attendance Has not been Activated Today'})
                     }
                        if(staff.signOut.timestamp){
                         
                             return res.status(422).json({error:'This Staff Has Already Logged Out'})
                        }else{
                         StaffAttendance.findOneAndUpdate({staffDetails:savedstaff._id,date:today},{
                             
                             signOut:{
                                 timestamp: Date.now()
                             }
                         },{
                             new:true
                         })
                         .populate('staffDetails',"_id name sex maritalStatus")
                         .then(data=>{
                             res.json({data,message:'Staff Sign Out Successfully'})
                         })
                     
                        .catch(err=>{
                         console.log(err)
                         })
                        }
                    })
                    .catch(err=>{
                        console.log(err)
                    })
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
                const today= new Date().toDateString()
                StaffAttendance.findOne({staffDetails:savedstaff._id,date:today})
                .then(staff=>{
                 if(!staff){
                     return res.status(422).json({error:'Staff Attendance Has not been Activated Today'})
                 }
                    if(staff.signOut.timestamp){
                       
                         return res.status(422).json({error:'This Staff Has Already Signed Out'})
                    }else{
                     StaffAttendance.findOneAndUpdate({staffDetails:savedstaff._id,date:today},{
                        
                         signOut:{
                             timestamp: Date.now()
                         }
                     },{
                         new:true
                     })
                     .populate('staffDetails',"_id name sex maritalStatus")
                     .then(data=>{
                         res.json({data,message:'Staff Sign Out Successfully'})
                     })
                 
                    .catch(err=>{
                     console.log(err)
                     })
                    }
                })
                .catch(err=>{
                    console.log(err)
                })
           
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
//************school Calendar Routes starts here************************/ 
//Set School Calendar NB: Dis is only to be used to start d app after which all dat is needed is update
//use PostMan or Insomia for this route

router.post('/admin/schoolcalendar',(req,res)=>{
   

    const {term,week} = req.body
    if(!term||!week){
        return res.status(422).json({error:'Please add all the fields'})
    }
    
    const calendar = new Calendar({
        term,
        week,

    })
    calendar.save()
    .then(result=>{
        res.json({calendar:result})
    })
    .catch(err=>{
        console.log(err)
    })
 
})

//Update School Calendar
router.put('/admin/updatecalendar',(req,res)=>{
    
    const {term,week} = req.body
    if(!term||!week){
        return res.status(422).json({error:'Please add all the fields'})
    }
    
    Calendar.findOneAndUpdate({},req.body,{
        new:true
    })
    .then(result=>{
        res.json({result,message:'Calendar updated Successfully'})
    })

   .catch(err=>{
    console.log(err)
    })
})
router.get('/admin/schoolcalendar',(req,res)=>{
    Calendar.findOne() 
    .then(data=>{
        res.json({data})
    })
    .catch(err=>{
        console.log(err)
    })
})



/************************ School Calendar Routes ends Here *****************/


//STaff Duty routes starts here
router.get('/staffduty',(req,res)=>{

})

module.exports = router