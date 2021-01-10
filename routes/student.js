const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Student = require('../models/student')
const Post = require('../models/post')
const Subject = require('../models/subjects')
const Result = require('../models/result')
const requireLogin = require('../middleware/requireLogin')
const staffLogin = require('../middleware/staffLogin')
const Calendar = require('../models/schoolCalendar')
const BookList = require('../models/bookList')
const Fees = require('../models/fees')
const StudentAttendance = require('../models/studentAttendanceRegister')
//Get Student by class

router.get('/students/:class',requireLogin,(req,res)=>{
    Student.find({stdClass:req.params.class})
    .select('-password')
    .populate('calendar',"_id year term week")
    .then(students=>{
     // const students = student.slice(0, 5)
        res.json({students})
    })
    .catch(err=>{
        console.log(err)
    })
})

/**********Result Route Starts ***********/
//Compute Result

router.get('/student/:id',staffLogin,(req,res)=>{
    Student.findOne({_id:req.params.id})
    .select("id section name DOB stdClass sex stateOfOrigin parentName  photo occupation")
    .populate('calendar',"_id year term")
    .then(student=>{
        Subject.findOne({section:student.section})
        .select("id subjects")
        .then((subjects)=>{
            res.json({student,subjects})
        }).catch(err=>{
        
                return res.status(422).json({error:err})
            
        })
    })
    .catch(err=>{
        return res.status(404).json({error:"student not found"})
    })
})

// Save Result

router.post('/student/result',staffLogin,(req,res)=>{
    
    const {id,scores,total,average,grade,scale,year,term,stdClass} = req.body
    if(!id||!scores||!total||!average){
        return res.status(422).json({error:'Please add all the fields'})
    }
            Result.find({ studentDetails:id})
            .populate('studentDetails',"_id name section stdClass")
            .then(results=>{
                
                if (results[0]===undefined){
                    
                        const result = new Result({
                            year,
                            term,
                            scores,
                            total,
                            average,
                            grade,
                            scale,
                            class:stdClass,
                            studentDetails:id
                    
                        })
                        result.save()
                        .then(result=>{
                            res.json({result})
                        })
                        .catch(err=>{
                            console.log(err)
                        })
                

                }else{
                    Calendar.findOne() 
                    .then(data=>{
                       
                        //check if student already have result for the term
                        const check = results.filter(result=>((result.year===data.year)&&(Number(result.term)===data.term)))
                        
                        if (check.length > 0){
                            return res.status(422).json({error:'This Student Already have result for this term'})
                        }else{
                           
                            const result = new Result({
                                year,
                                term,
                                scores,
                                total,
                                average,
                                grade,
                                scale,
                                class:stdClass,
                                studentDetails:id
                        
                            })
                            result.save()
                            .then(result=>{
                                res.json({result})
                            })
                            .catch(err=>{
                                console.log(err)
                            })
                        }
                    })
                    
                }
            })
     
        .catch(err=>{
            console.log(err)
        })    
})



// get Student result
router.get('/studentresult/:id',(req,res)=>{
  
    Result.find({studentDetails:req.params.id})
    .populate('studentDetails',"_id name section stdClass sex DOB photo")
    .populate('calendar',"_id year term")
    .then(result=>{
       
        res.json({result})
    })
    .catch(err=>{
        console.log(err)
    })
    
})

// GEt Broad Sheet For A Class

router.get('/studentbroad/:class',(req,res)=>{
    Calendar.findOne() 
    .then(data=>{
        Result.find({class:req.params.class,year:data.year,term:data.term})
        .populate('studentDetails',"_id name sex section stdClass")
        .then(result=>{
            const results = result.sort((a, b) =>a.average < b.average ? 1 : -1)
            res.json({results})
        })
        .catch(err=>{
            console.log(err)
        })
    })
    .catch(err=>{
        console.log(err)
    })
})


//update student Result
router.put('/student/resultupdate/:id',staffLogin,(req,res)=>{
   
    const{data} = req.body

    Result.findByIdAndUpdate(req.params.id,data,{
        new:true
    })
    .then(result=>{
        res.json({result,message:'Result updated Successfully'})
    })

   .catch(err=>{
    console.log(err)
    })
    
})

/*****************REsult Route Ends *************** */

/*****************Attendance Records Begin *************** */
//Mark Class Attendance
router.get('/student/attendance/:class',requireLogin,(req,res)=>{
  
    const {date} = req.query
    StudentAttendance.find({stdClass:req.params.class,date})
    .then(result=>{
        if (result[0]===undefined){
            Student.find({stdClass:req.params.class})
            .select('-password')
            .populate('calendar',"_id year term week")
            .then(students=>{
             // const students = student.slice(0, 5)
                res.json({students})
            })
            .catch(err=>{
                console.log(err)
            })
        }else{
           
            res.json({result,message:'Attendance For this class has already been taken'})
        }
    })
    .catch(err=>{
        console.log(err)
    })
})

//save and update class attendance

router.post('/student/markattendance',staffLogin,(req,res)=>{

const {data:{studentId,year,term,week,date,section,stdClass,status}}= req.body
    StudentAttendance.find({studentDetails:studentId,date:date})
    .then(result=>{
        if (result[0]===undefined){
            
            const record = new StudentAttendance({
                year,
                term,
                status,
                date,
                week,
                section,
                stdClass,
                studentDetails:studentId
        
            })
            record.save()
            .then(result=>{
                res.json({result,message:'Attendance Saved Successfully'})
            })
            .catch(err=>{
                console.log(err)
            })
    
        }else{
            
           StudentAttendance.findOneAndUpdate({studentDetails:studentId,date:date},req.body.data,{
               new:true
           })
           .then(result=>{
            res.json({result,message:'Attendance updated Successfully'})
        })
    
       .catch(err=>{
        console.log(err)
        })
        }

}).catch(err=>{
    console.log(err)
})
})


//get termly attendance single student
router.get('/student/termattendance/:id',(req,res)=>{
    Calendar.findOne() 
    .then(data=>{
        
        StudentAttendance.find({studentDetails:req.params.id,term:data.term})
        .populate('studentDetails',"_id name sex section stdClass")
        .then(result=>{
           const results = result.sort((a, b) =>a.createdAt < b.createdAt ? -1 : 1)
            res.json({results})
        })
        .catch(err=>{
            console.log(err)
        })
    })
    .catch(err=>{
        console.log(err)
    })
})

//get all student attendance for a given day by stdclass
router.get('/student/classdailyattendance/:stdClass',(req,res)=>{
  
    const {stdClass} = req.params
    const {date} = req.query
    
         StudentAttendance.find({stdClass,date})
         .populate('studentDetails',"_id name sex section stdClass")
         .then(result=>{
             //console.log(result)
             res.json({result})
         })
         .catch(err=>{
             console.log(err)
         })
         
     })

//get all student attendance for a given day by grade/section
router.get('/student/studentdailyattendance/:section',(req,res)=>{
  
    const {section} = req.params
    const {date} = req.query
    
         StudentAttendance.find({section,date})
         .then(result=>{
             //console.log(result)
             res.json({result})
         })
         .catch(err=>{
             console.log(err)
         })
         
     })


/****************Attendance Route Ends *************** */


/*****************Book Records Begin *************** */

//Get Student Book Record

router.get('/studentbook/:id',(req,res)=>{
    Student.findOne({_id:req.params.id})
    .select("id section name DOB stdClass bookList")
    .populate('calendar',"_id year term")
    .then(student=>{
        
        if(student.bookList[0]){
           
            res.json({student})
        }else{
            
            BookList.findOne({bookClass:student.stdClass})
            .then((bookList)=>{
               
                if(!bookList){
                   return res.status(422).json({error:'No book List is assigned to this student'})
                }
                const b = bookList.list.map(list=>{
                  
                    return  {
                       author:list.author,
                       title:list.title,
                       price:list.price,
                       paid:false,
                       condition:'good'
                        }
                        
                })
               
                Student.findByIdAndUpdate(student._id,{ $set: { bookList: b }},{
                    new:true
                })
                .select("id section name DOB stdClass bookList")
                .populate('calendar',"_id year term")
                 .then(student=>{
                    res.json({student})
                 }) 
                  .catch(err=>{
                    console.log(err)
                })
            }).catch(err=>{
            
                    return res.status(422).json({error:err})
                
            })
        }
        
    })
    
    .catch(err=>{
        return res.status(404).json({error:"student not found"})
    })
})

//update student book Record

router.put('/studentbooklist/:id',(req,res)=>{
    
    const {bookList} = req.body
    Student.findByIdAndUpdate(req.params.id,{ $set: { bookList: bookList }},{
        new:true
    })
    .then(result=>{
        res.json({result,message:'Booklist updated Successfully'})
    })

   .catch(err=>{
    console.log(err)
    })
})

/*****************Book Records Route Ends *************** */

/**************Fees and Payment starts here*************** */
//get Fees and payment for a student

router.get('/studentfees/:id',(req,res)=>{
    Fees.find({studentDetails:req.params.id})
    .populate('studentDetails',"_id name section stdClass")
    .populate('calendar',"_id year term")
    .then(result=>{
        if(result[0]){
          
            res.json({result})
        }else{
            Student.findOne({_id:req.params.id})
            .populate('calendar',"_id year term")
            .then(result=>{
               
          const fees = new Fees({
            
                year:result.calendar.year,
                term:result.calendar.term,
                stdClass:result.stdClass,
                schoolFees:{
                  amount:100000,
                  paid:0,
                  remark:'Not Paid'
                },
                uniform_otherwears:{
                  amount:10000,
                  paid:0,
                  remark:'Not Paid'
                },
                examFees:{
                  amount:2000,
                  paid:0,
                  remark:'Not Paid'
                },
                excursion:{
                  amount:10000,
                  paid:0,
                  remark:'Not Paid'
                },
                books:{
                  amount:10000,
                  paid:0,
                  remark:'Not Paid'
                },
                studentDetails:result._id
              
          })
          fees.populate('studentDetails',"_id name section stdClass").execPopulate();
          fees.save()
          .then(result=>{
             
              res.json({result:[result]})
          })
          .catch(err=>{
              console.log(err)
          })
          
            })  
            .catch(err=>{
                console.log(err)
            })
      
        }
        
            
         
    })
    .catch(err=>{
        console.log(err)
    })
})
//update Student Fee
router.put('/studentfeeupdate/:id',(req,res)=>{
    const{fees:{
        schoolFees,
        uniform_otherwears,
        examFees,
        excursion,
        books
    }} = req.body
   
    Fees.findByIdAndUpdate({ _id:req.params.id}, { schoolFees,uniform_otherwears,examFees,excursion,books },{
        new:true
    })
    .then(result=>{
        res.json({result,message:'Fees Saved Successfully'})
    })

   .catch(err=>{
    console.log(err)
    })
    
}) 

//Get Fees For a class

router.get('/student/fees/:class',requireLogin,(req,res)=>{

    const year = Number(req.query.year)
    const term = Number(req.query.term)
        Fees.find({stdClass:req.params.class,year,term})
        .populate('studentDetails',"_id name stdClass section")
        .then(fees=>{
            res.json({fees})
        })
        .catch(err=>{
            console.log(err)
    })
 
})

//update Student Photo

router.put('/student/updatephoto/:id',requireLogin,(req,res)=>{
    Student.findByIdAndUpdate(req.params.id,{
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


router.post('/search-students',(req,res)=>{
    // let userPattern = new RegExp("^"+req.body.query)
     const searchKeyword = req.body.query
 
     Student.find()
     .select("id email name photo")
     .then(student=>{
      
        const students = student.filter(x=>x.name.first.includes(searchKeyword)||x.name.last.includes(searchKeyword))
         res.json({students})
     })
     .catch(err=>{
         console.log(err)
     })
 })
 

module.exports = router