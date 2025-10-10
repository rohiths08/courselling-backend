const { Router } = require('express')  
const coursesRouter = Router();

coursesRouter.post('/purchese-course',(req,res)=>{
    console.log(req.body)
    res.send('purchase successful')
})

coursesRouter.get('/preview',(req,res)=>{
    console.log(req.body)
    res.send('courses list')
})

module.exports={
    coursesRouter:coursesRouter
}