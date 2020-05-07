const express=require("express")
const stu_model=require("../models/stu_model")
const router=new express.Router()
const auth=require("../middleware/auth")
const multer=require('multer')
const sharp=require('sharp')
const {sendemailopen,sendemailclose}=require("../email/account")


// post student data
router.post("/student",async(req,res)=>{
    const student=new stu_model(req.body)
    try{
      await student.save()
      sendemailopen(student.email,student.name)
      const token=await student.getAuthToken()
      res.send({student,token})
    }
    catch(e){
        res.status(400).send(e)
    }   
})

router.post("/student/login",async(req,res)=>{
    try{
    const student=await stu_model.findcredential(req.body.email,req.body.password)
    const token=await student.getAuthToken()
    res.send({student:student,token})
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.post("/student/logout",auth,async (req,res)=>{
    try{
        req.student.tokens=req.student.tokens.filter((token)=>{
            return token.token!==req.token
        })
        await req.student.save()
        res.send("logged out")
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.post("/student/logoutall",auth,async(req,res)=>{
   try{
    req.student.tokens=[]
    await req.student.save()
    res.send("logged out all")
   }catch(e){
       res.status(500).send(e)
   }
})

// the below router shows the all others data while we check for one user authentication so we gone for student/me
router.get("/student",async(req,res)=>{
 try{
     const student=await stu_model.find({})
     res.send(student)
 }
 catch(e){
     res.status(400).send(e)
 }
})

router.get("/student/me",auth,(req,res)=>{
    try{
        res.send(req.student)
    }
    catch(e){
        res.status(400).send(e)
    }
})

//here we don't need this router
router.get("/student/:id",async(req,res)=>{
  try{
      const student=await stu_model.findById(req.params.id)
      if(!student)
      {
          return res.send("ID nor matched")
      }
      res.send(student)
  }
  catch(e){
      res.status(400).send(e)
  }
})

router.patch("/student/me",auth,async(req,res)=>{
  const updates=Object.keys(req.body)
  const allowedupdate=['name','age','email','password']
  const isvalidupdate= await updates.every((update)=>{ return allowedupdate.includes(update)})
  if(!isvalidupdate)
  {
      return res.status(404).send("you are trying to update unauthorized key value ")
  }
  try{
    //   const student=await stu_model.findById(req.params.id)
    //   updates.forEach((update)=>student[update]=req.body[update])
    //   await student.save()
    //   if(!student)
    //   {
    //       return res.send("ID matched student not found")
    //   }
    updates.forEach((update)=>req.student[update]=req.body[update])
      res.send(req.student)
  }
  catch(e){
      res.status(400).send(e)
  }
})

router.delete("/student/me",auth,async(req,res)=>{
  try{
    //   const student=await stu_model.findByIdAndDelete(req.student._id)
    //   if(!student)
    //   {
    //       return res.status(400).send("ID matched student data is not matched")
    //   }
    await req.student.remove()// remove() is mongoose document...
    sendemailclose(req.student.email,req.student.name)
    res.status(200).send(req.student)
  }
  catch(e){
      res.status(400).send(e)
  }
})

const upload=multer({
    // dest:"avatars",  //this is file storing folder name
    limits:{         // there is many limits but here we use file sixe and type 
        fileSize: 1000000     // 100000==1MB
    },
    fileFilter(req,file,cb){       // this is used for file filter like pdf or docx or jpg or doc etc
        if(!file.originalname.match(/\.(jpg|png|jpeg)$/)){
            return cb(new Error("must be images"))
        }
        cb(undefined,true)
        //if(file.originalname.endsWith(".doc")||file.originalname.endsWith(".docx"))

    }
})
router.post("/student/me/avatar",auth,upload.single('stu_file'),async (req,res)=>{
    
    const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.student.file=buffer
    // req.student.file=req.file.buffer
    await req.student.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.delete("/student/me/avatar",auth,async(req,res)=>{
    req.student.file=undefined
    await req.student.save()
    res.send("file deleted")
})

router.get('/upload/:id/avatar',async(req,res)=>{
    try
    {
    const student=await stu_model.findById(req.params.id);
    if(!student||!student.file)
    {
        throw new Error()
    }
    res.set('Content-Type','image/png')
    res.send(student.file)
    }
    catch(e){
        res.status(400).send()
    }
})


module.exports=router