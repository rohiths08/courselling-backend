const express = require('express');
const {userRouter} = require('./routes/user')
const {coursesRouter} = require('./routes/courses')
const {adRouter} = require('./routes/admin')
const mongoose = require("mongoose");
const app = express()

app.use(express.json())
app.use("/user",userRouter)
app.use("/courses",coursesRouter)
app.use("/admin",adRouter)

async function main(){
    await mongoose.connect("mongodb+srv://cfylover05_db_user:A06hczWBWiSBsCKl@cluster0.lrm3pt6.mongodb.net/course-api");
    console.log("Connected to MongoDB");
    app.listen(3000, () => {
        console.log("Server started at port 3000");
      });
}
main()