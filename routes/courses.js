const { Router } = require('express')  
const coursesRouter = Router();
const {Course,Purchase}=require("../db")
const {userAuth}=require("../middleware/user")  
const z=require('zod');


coursesRouter.post('/purchase-course', userAuth, async (req, res) => {
    // Zod schema to validate courseId
    const purchaseschema = z.object({
        courseId: z.string().length(24) // must be valid ObjectId
    });

    const validation = purchaseschema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "Validation error",
            error: validation.error.format()
        });
    }

    try {
        const userId = req.userId;
        const { courseId } = req.body;

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });

        // Check if already purchased
        const existing = await Purchase.findOne({ userId, courseId });
        if (existing) return res.status(409).json({ message: "Course already purchased" });

        await Purchase.create({ userId, courseId });

        res.send('Purchase successful');
    } catch (e) {
        res.status(500).json({ message: "Error purchasing course", error: e.message });
    }
});


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