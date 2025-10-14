const {Router}=require('express')
const adRouter=Router()
const {Admin, Course}=require("../db")
const jwt = require('jsonwebtoken');
const { JWT_adminSECRET } = require('../config');
const {adminAuth}=require("../middleware/admin")
const z=require('zod');
const bcrypt = require('bcrypt');

// const JWT
adRouter.post('/admin-signup', async (req, res) => {
    // Destructure request body to get admin details
    const { email, password, fname, lname } = req.body;

    // Zod schema to validate admin input
    const adminschema = z.object({
        email: z.string().email(),       // must be a valid email
        password: z.string().min(5).max(20), // password length between 5 and 20
        fname: z.string().min(2),       // first name minimum 2 characters
        lname: z.string().min(2)        // last name minimum 2 characters
    });

    // Validate the input data
    const validation = adminschema.safeParse({ email, password, fname, lname });
    if (!validation.success) 
        return res.status(400).json({
            message: "Validation error",
            error: validation.error.format() // return formatted Zod validation errors
        });

    try { 
        // Check if admin with same email already exists
        const existingUser = await Admin.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered" });
        }

        // Hash the password before storing in database (never store plain text)
        const hashpass = await bcrypt.hash(password, 10);

        // Create new admin in the database
        await Admin.create({
            email,
            password: hashpass, // store hashed password
            fname,
            lname
        });

        // Send success response
        res.json({ message: "Sign up successful" });
    } catch (e) {
        // Handle unexpected errors
        res.status(500).json({ message: "Error in signup", error: e.message });
    }
});


adRouter.post('/admin-signin', async (req, res) => {
    const { email, password } = req.body;

    const adminschema = z.object({
        email: z.string().email(),
        password: z.string().min(5).max(20)
    });

    const validation = adminschema.safeParse({ email, password });
    if (!validation.success)
        return res.status(400).json({ message: "Validation error", error: validation.error.format() });

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(401).json({ message: "Invalid credentials" });

        const isValidUser = await bcrypt.compare(password, admin.password);
        if (!isValidUser) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: admin._id }, JWT_adminSECRET);
        res.json({ token: token, message: "Sign in successful" });
    } catch (e) {
        res.status(401).json({ message: "Invalid credentials" });
    }
});


//pipeline to upload the image
adRouter.post('/create-course',adminAuth,async (req,res)=>{
    const adminId=req.adminId;
    const {title,description,price,imageUrl}=req.body;
    const course=await Course.create({title,description,price,imageUrl,creatorid:adminId})
    res.json({
        message:"Course created successfully",
        creatorid:course._id
    })
})


adRouter.put('/create-course',adminAuth,async (req,res)=>{
    const adminId=req.adminId;
    const {courseId,title,description,price,imageUrl}=req.body;
const course=await Course.findOneAndUpdate({_id:courseId,creatorid:adminId},{title,description,price,imageUrl})//creatorid:adminId to ensure that only the creator can update the course
    res.json({
        message:"Course updated successfully",
        courseId:course._id
    })
})
adRouter.get('/create-course/all-courses',adminAuth,async (req,res)=>{
     const adminId=req.adminId;
    
const course=await Course.find({creatorid:adminId})//creatorid:adminId to ensure that only the creator can update the course
    res.json({
        message:"All Courses fetched successfully",
        course
})
})

module.exports={
    adRouter:adRouter
}