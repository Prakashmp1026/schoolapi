const express=require("express")
const hw_model=require("../models/hw-model")
const auth=require("../middleware/auth")
const router=new express.Router()

router.post("/homework",auth,async(req,res)=>{
    // const homework=new hw_model(req.body)

    const homework=new hw_model({
        ... req.body,
        stu_id:req.student._id
    })
    try{
        await homework.save()
        res.send(homework)
    }
    catch(e){
        res.status(400).send(e)
    }
    
})

//below we add some features to see our student's task
//below router we add filtering, pagination(limit&skip)
//GET homework?completed=false
//GET homework?limit=2&skip=0
//GET homework?sortBy:createdAt:1
router.get("/homework",auth,async(req,res)=>{
    
    const match={}
    if(req.query.completed){
        match.completed =req.query.completed==='true'
    }
    try{
        // const homework=await hw_model.find({stu_id:req.student._id})
        const student=await req.student.populate({
            path:"hw_id",
            match:match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort:{
                    //createdAt:-1 //here i gives data in default
                    completed:1
                }
            }
            // match:{
            //     completed:true
            // }
        }).execPopulate()
        res.send(student.hw_id)
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.get("/homework/:id",auth,async(req,res)=>{
    try{
        // const homework=await hw_model.findById(req.params.id)
        const _id=req.params.id
        const homework=await hw_model.findOne({_id,stu_id:req.student._id})
        if(!homework)
        {
            return res.send("ID nor matched")
        }
        res.status(200).send(homework)
    }
    catch(e){
        res.status(400).send(e)
    }
   
})

router.patch("/homework/:id",auth,async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedupdate=['description','completed']
    const isvalidupdate= await updates.every((update)=>{ return allowedupdate.includes(update)})
    if(!isvalidupdate)
    {
        return res.status(404).send("you are trying to update unauthorized key value ")
    }
    try{
        // const homework=await hw_model.findById(req.params.id)      
        const homework=await hw_model.findOne({_id:req.params.id,stu_id:req.student._id})
        if(!homework)
        {
            return res.send("ID matched homework not found")
        }
        updates.forEach((update)=>homework[update]=req.body[update])
        await homework.save()
        res.status(200).send(homework)
    }
    catch(e){
        res.status(400).send(e)
    } 

})

router.delete("/homework/:id",auth,async(req,res)=>{
    try{
        // const homework=await hw_model.findByIdAndDelete(req.params.id)
        const homework=await hw_model.findOneAndDelete({_id:req.params.id,stu_id:req.student._id})
        if(!homework)
        {
            return res.status(400).send("ID matched homework data is not matched")
        }
        res.status(200).send(homework)
    }
    catch(e){
        res.status(400).send(e)
    }
})

module.exports=router