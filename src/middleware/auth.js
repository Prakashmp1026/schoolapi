const jwt=require('jsonwebtoken')
const stu_model=require("../models/stu_model")

const auth=async(req,res,next)=>{
   try{
       const token=req.header("Authorization").replace("Bearer ","")
       const decode=jwt.verify(token,process.env.JWT_TOKEN)
       const student =await stu_model.findOne({_id:decode._id,'tokens.token':token})
        
       if(!student){
           throw new Error()
       }
       req.student=student
       req.token=token
       next()
   }
   catch(e){
       res.status(401).send({error:"please authenticate!!"})
   }
}

module.exports=auth