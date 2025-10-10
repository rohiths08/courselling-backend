const express = require('express');
const {userRouter} = require('./routes/user')
const {coursesRouter} = require('./routes/courses')
const {adRouter} = require('./routes/admin')
const app = express()

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.use("/user",userRouter)
app.use("/courses",coursesRouter)
app.use("/admin",adRouter)

app.listen(3000)
