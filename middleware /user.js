const jwt=require('jsonwebtoken');  
const {JWT_userSECRET} =require('../config')    

function userAuth(req,res,next){
    const token=req.headers.token;
   const decoded=jwt.verify(token,JWT_userSECRET)
   if(decoded){
    req.userId=decoded.id;
    next()
   }
   else{
    res.status(401).json({message:"Unauthorized"})
   }
}

module.exports={
    userAuth:userAuth
}