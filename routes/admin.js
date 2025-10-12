const {Router}=require('express')
const adRouter=Router()
const {Admin, Course}=require("../db")
const jwt = require('jsonwebtoken');
const { JWT_adminSECRET } = require('../config');
const {adminAuth}=require('../middleware/admin')
// const JWT

adRouter.post('/admin-signup',async (req,res)=>{
    const {email,password,fname,lname}=req.body;
    //adding the zod validation here will be better
    //TODO: hash the password as plane text password is not stored in db
   try{ await Admin.create({email,password,fname,lname})

    res.json({ message: "sign up successful" });
}catch(e){
    res.send({message:"Error in signup",error:e.message})
}
})

adRouter.post('/admin-signin',async (req,res)=>{
    const {email,password}=req.body;
    //TODO: add zod validation here
    const admin= await Admin.findOne({email,password})
    
    if(admin){
        const token =jwt.sign({id:admin._id},JWT_adminSECRET)
        res.json({ token:token,message: "sign in successful" });
        
    }
    else{
        res.status(401).json({message:"Invalid credentials"})
    }
})

//pipeline to upload the image
adRouter.post('/create-course',async (req,res)=>{
    const adminId=req.adminId;
    const {title,description,price,imageUrl,creatorid}=req.body;
    const course=await Course.create({title,description,price,imageUrl,creatorid:adminId})
    res.json({
        message:"Course created successfully",
        creatorid:course._id
    })
})


adRouter.put('/create-course',async (req,res)=>{
    const adminId=req.adminId;
    const {courseId,title,description,price,imageUrl}=req.body;
const course=await Course.findOneAndUpdate({_id:courseId,creatorid:adminId},{title,description,price,imageUrl})
    res.send('course updated')
})
adRouter.get('/create-course/all-courses',(req,res)=>{
    console.log(req.body)
    res.send('all courses list')
})

module.exports={
    adRouter:adRouter
}