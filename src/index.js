const express=require("express")
//for creating port  
require("./DB/mongoose")
// its ensure connect the database

const stu_model=require("./models/stu_model")
const hw_model=require("./models/hw-model")
// here accessing the models

const stu_router=require("./routers/student")
const hw_router=require("./routers/homework")
//here accessing the routers 
const app=express()

const port=process.env.PORT

app.use((req,res,next)=>{
    console.log("express middleware checking ^_^ ")
    next()
})
//middleware

app.use(express.json())
//here parshing the input to json format

app.use(stu_router)
app.use(hw_router)

app.listen(port,()=>{
    console.log(`server created ${port}`)
})
 


// const main=async()=>{
//     // const homework=await hw_model.findById("5ead7a2eaafa811a6041387c")
//     // await homework.populate("stu_id").execPopulate()
//     // console.log(homework)

//     const student=await stu_model.findById("5ead79b52dd9682a3c35af69")
//     await student.populate("hw_id").execPopulate()
//     console.log(student.hw_id)

// }
// main()
// const multer=require('multer')
// const uploads=multer({
//     dest:'files',
//     limits:{         // there is many limits but here we use file sixe and type 
//         fileSize: 1000000     // 100000==1MB
//     },
//     fileFilter(req,file,cb){       // this is used for file filter like pdf or docx or jpg or doc etc
//         if(file.originalname.endsWith(".doc")||file.originalname.endsWith(".docx")){
//             return cb(undefined,true)
//         }
//         cb(new Error("must be docs"))

//     }
// })

// app.post('/upload',uploads.single('stu_files'),(req,res)=>{
//     res.send()
// },(error,req,res,next)=>{
//     res.status(400).send({error:error.message})
// })