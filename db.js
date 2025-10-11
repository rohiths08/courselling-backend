const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
    
  fname: String,
  lname: String,
  email: {type : String,unique : true},
  password: String,
});

const courseSchema = new Schema({
   
  title: String,
  description: String,
  ImageUrl: String,
  price: Number,
  creatorid:ObjectId,
});

const adminSchema = new Schema({
    email: {type : String,unique : true},
  fname: String,
  laname: String,
  password: String,
});
const purchaseSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  courseId: { type: Schema.Types.ObjectId, ref: "Course" },
});

const User = mongoose.model("User", userSchema);
const Course = mongoose.model("Course", courseSchema);
const Admin = mongoose.model("Admin", adminSchema);
const Purchase = mongoose.model("Purchase", purchaseSchema);

module.exports={User,Course,Admin,Purchase}