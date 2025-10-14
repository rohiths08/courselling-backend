const { Router } = require('express')  
const coursesRouter = Router();
const {Course,Purchase}=require("../db")
const {userAuth}=require("../middleware/user")  

coursesRouter.post('/purchase-course',userAuth,async (req,res)=>{
    try {
        const userId=req.userId;
    const courseId=req.body.courseId;
    //check that the course has paid or not 
    await Purchase.create({userId,courseId})

    res.send('purchase successful')
    }catch(e){
        res.status(500).json({message:"Error purchasing course",error:e.message})
    }
})

coursesRouter.get('/preview',async (req,res)=>{
    try 
    {
        const courses= await Course.find({})//displays all of the courses 
    
    res.send(courses)}catch(e){
        res.status(500).json({message:"Error fetching courses",error:e.message})
    }
})

module.exports={
    coursesRouter:coursesRouter
}