const { Router } = require('express');
const {User,Purchase, Course}=require("../db")
const jwt = require('jsonwebtoken');
const { JWT_userSECRET } = require('../config');
const bcrypt = require('bcrypt');
const z=require('zod');
const userRouter = Router();
const {userAuth}=require("../middleware/user");
const { ConnectionStates } = require('mongoose');


userRouter.post('/sign-up',async (req, res) => {
    const {email,password,fname,lname}=req.body;
    //adding the zod validation here will be better
    const userschema=z.object({
        email:z.string().email(),
        password:z.string().min(5).max(20),
        fname:z.string().min(2),
        lname:z.string().min(2)
    })

    const validation=userschema.safeParse({email,password,fname,lname})
    if(!validation.success) 
        return res.status(400).json({message:"Validation error",error:validation.error.format()
    })
    //TODO: hash the password as plane text password is not stored in db
     // --- IGNORE ---

   try{ 
    // Check if user already exists
    const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered" });
        }
        // hashing the password before storing it in the database
    const hashpass=await bcrypt.hash(password,10);
    await User.create({email,password:hashpass,fname,lname})

    res.json({ message: "sign up successful" });
}catch(e){
    res.status(500).json({message:"Error in signup",error:e.message})
}
});


userRouter.post('/sign-in', async (req, res) => {
    const { email, password } = req.body;

    // Zod validation
    const userschema = z.object({
        email: z.string().email(),
        password: z.string().min(5).max(20)
    });

    const validation = userschema.safeParse({ email, password });
    if (!validation.success) 
        return res.status(400).json({ message: "Validation error", error: validation.error.format() });

    try {
        // Find user by email
        const user = await User.findOne({ email });
        // Compare password
        const isValidUser = await bcrypt.compare(password, user.password);
        if (!user||!isValidUser) return res.status(401).json({ message: "Invalid credentials" });

        // Generate token
        const token = jwt.sign({ id: user._id }, JWT_userSECRET);
        res.json({ token, message: "Sign in successful" });

    } catch (e) {
        res.status(500).json({ message: "Error signing in", error: e.message });
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