require('dotenv').config();
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
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");
    app.listen(3000, () => {
        console.log("Server started at port 3000");
      });
}
main()