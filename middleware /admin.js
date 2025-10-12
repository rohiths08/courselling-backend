const jwt=require('jsonwebtoken');
const {JWT_adminSECRET} =require('../config')
// const JWT_SECRET

function adminAuth(req,res,next){
    const token=req.headers.token;
   const decoded=jwt.verify(token,JWT_adminSECRET)
   if(decoded){
    req.adminId=decoded.id;
    next()
   }
   else{
    res.status(401).json({message:"Unauthorized"})
   }
}

module.exports={
    adminAuth:adminAuth
}