const {Router}=require('express')
const adRouter=Router()

adRouter.post('/admin-signup',(req,res)=>{
    console.log(req.body)
    res.send('admin signup successful')
})

adRouter.post('/admin-signin',(req,res)=>{
    console.log(req.body)
    res.send('admin signin successful')
})

adRouter.post('/create-course',(req,res)=>{
    console.log(req.body)
    res.send('course created')
})
adRouter.put('/create-course',(req,res)=>{
    console.log(req.body)
    res.send('course updated')
})
adRouter.get('/all-courses',(req,res)=>{
    console.log(req.body)
    res.send('all courses list')
})

module.exports={
    adRouter:adRouter
}