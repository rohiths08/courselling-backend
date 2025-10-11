const {Router}=require('express')
const adRouter=Router()
const {Admin}=require("../db")
const jwt = require('jsonwebtoken');
const JWT_SECRET="chinnu0"//different jwt secret for admin

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
        const token =jwt.sign({id:admin._id},JWT_SECRET)
        res.json({ token:token,message: "sign in successful" });
        
    }
    else{
        res.status(401).json({message:"Invalid credentials"})
    }
})

adRouter.post('/create-course',(req,res)=>{
    console.log(req.body)
    res.send('course created')
})
adRouter.put('/create-course',(req,res)=>{
    console.log(req.body)
    res.send('course updated')
})
adRouter.get('/create-course/all-courses',(req,res)=>{
    console.log(req.body)
    res.send('all courses list')
})

module.exports={
    adRouter:adRouter
}