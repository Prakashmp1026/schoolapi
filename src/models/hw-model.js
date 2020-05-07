const mongoose=require('mongoose')
const validator=require('validator')

const hw_schema= new mongoose.Schema({
    description:{
        type:String,
        required:true,
        toLowerCase:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    stu_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"student"        
    }
},{
    timestamps:true
})
const hw_model=mongoose.model("home_work",hw_schema)  

module.exports=hw_model