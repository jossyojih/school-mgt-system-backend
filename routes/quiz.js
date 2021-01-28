const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Quiz = require('../models/quiz')
const Calendar = require('../models/schoolCalendar')
const requireLogin = require('../middleware/requireLogin')


router.post('/newquiz',(req,res)=>{

    const {term,question,stdClass,subject,week,deadline} = req.body
    
    const quiz = new Quiz({
        term,
        questions:question,
        stdClass,
        subject,
        week,
        deadline
        
    })
    quiz.save()
    .then(result=>{
        res.json({quiz:result})
    })
    .catch(err=>{
        console.log(err)
    })
    
})

//Get All quiz for a class this week
router.get('/quiz/:class',(req,res)=>{
    const {week,term} = req.query
    Quiz.find({stdClass:req.params.class,term,week})
    .populate("submissionInfo.submittedBy","_id name photo")
    .then(quiz=>{
        res.json({quiz})
    })
    .catch(err=>{
        console.log(err)
     })
    })
  
//Get Single Quiz for a student
router.get('/getquiz/:id',(req,res)=>{
   
    Quiz.findOne({_id:req.params.id})
    .then(quiz=>{
        res.json({quiz})
    })
    .catch(err=>{
        console.log(err)
    })
    
    })

//One Student Submit Quiz

router.put('/submitquiz',requireLogin,(req,res)=>{
  
    const submissionInfo = {
        score:req.body.score,
        submittedBy:req.student._id
    }
    Quiz.findByIdAndUpdate(req.body.quizId,{
        $push:{submissionInfo}
    },{
        new:true
    })
    .populate("submissionInfo.submittedBy","_id name photo")
   // .populate("postedBy","_id name photo")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

//Update Quiz
router.put('/updatequiz/:id',requireLogin,(req,res)=>{
    console.log(req.params.id)
    const {term,question,stdClass,subject,week,deadline} = req.body
   
        Quiz.findByIdAndUpdate(req.params.id,{
        term,
        questions:question,
        stdClass,
        subject,
        week,
        deadline
    },{
        new:true
    })
    .then(result=>{
        res.json({result,message:'Result updated Successfully'})
    })

   .catch(err=>{
    console.log(err)
    })
})

module.exports = router