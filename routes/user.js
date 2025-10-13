const { Router } = require('express');
const {User,Purchase, Course}=require("../db")
const jwt = require('jsonwebtoken');
const { JWT_userSECRET } = require('../config');
const userRouter = Router();
const {userAuth}=require("../middleware/user")


userRouter.post('/sign-up',async (req, res) => {
    const {email,password,fname,lname}=req.body;
    //adding the zod validation here will be better
    //TODO: hash the password as plane text password is not stored in db
   try{ await User.create({email,password,fname,lname})

    res.json({ message: "sign up successful" });
}catch(e){
    res.send({message:"Error in signup",error:e.message})
}
});

userRouter.post('/sign-in', async (req, res) => {
    const {email,password}=req.body;
    //TODO: add zod validation here
    const user= await User.findOne({email,password})
    
    if(user){
        const token =jwt.sign({id:user._id},JWT_userSECRET)
        res.json({ token:token,message: "sign in successful" });
        
    }
    else{
        res.status(401).json({message:"Invalid credentials"})
    }
});

userRouter.get('/purchase-course',userAuth, async (req, res) => {
    const userId=req.userId;
    const purchases= await Purchase.find({userId})
    const courses=await Course.find({
        _id:{$in:purchases.map((x=>x.courseId))}
    })
    res.json({
        
        purchases,
        courses
     });
});

module.exports = {
    userRouter:userRouter
};