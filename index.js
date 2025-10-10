const express = require('express');

const app = express()

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.post('/user/sign-in',(req,res)=>{
    console.log(req.body)
    res.send('sign in successful')
})
app.post('/user/sign-up',(req,res)=>{
    console.log(req.body)
    res.send('sign up successful')
})

app.get('/user/purchese-course',(req,res)=>{
    console.log(req.body)
    res.send('purchase successful')
})
app.post('/courses/purchese-course',(req,res)=>{
    console.log(req.body)
    res.send('purchase successful')
})

app.get('/courses',(req,res)=>{
    console.log(req.body)
    res.send('courses list')
})
app.listen(3000)
