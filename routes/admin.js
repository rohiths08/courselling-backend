const {Router}=require('express')
const adRouter=Router()
const {Admin}=require("../db")

adRouter.post('/admin-signup',(req,res)=>{
    const email=req.body.email
    const password=req.body.password
    const fname=req.body.fname
    const laname=req.body.laname

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
adRouter.get('/create-course/all-courses',(req,res)=>{
    console.log(req.body)
    res.send('all courses list')
})

module.exports={
    adRouter:adRouter
}