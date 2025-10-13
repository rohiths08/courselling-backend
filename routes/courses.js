const { Router } = require('express')  
const coursesRouter = Router();
const {Course,Purchase}=require("../db")
const {userAuth}=require("../middleware/user")  

coursesRouter.post('/purchese-course',userAuth,async (req,res)=>{
    const userId=req.userId;
    const courseId=req.body.courseId;
    //check that the course has paid or not 
    await Purchase.create({userId,courseId})

    res.send('purchase successful')
})

coursesRouter.get('/preview',async (req,res)=>{
    const courses= await Course.find({})
    
    res.send(courses)
})

module.exports={
    coursesRouter:coursesRouter
}