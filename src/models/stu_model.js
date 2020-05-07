const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcrypt')
const jwt=require("jsonwebtoken")
const hw_model=require("../models/hw-model")

const stu_schema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        uppercase:true
    },
    age:{
        type:Number,
        required:true,
        validate(value){
            if(value<10)
            {
                throw new ('age should be above 10')
            }
        },
        default:11
    },
    email:{
        type:String,
        require:true,
        validate(value){
            if(! validator.isEmail(value)){
                throw new ('invalid email id')
            }
        },
        lowercase:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        trim:true,
        validate(value)
        {
            if(value.toLowerCase().includes("password"))
            {
                throw new ('password is not password')
            }
        },
        minlength:4             
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    file:{
        type:Buffer
    }
},
{
    timestamps:true
})

stu_schema.virtual("hw_id",{
    ref:"home_work",
    localField:"_id",
    foreignField:"stu_id"
})



// this toJSON method calling automatically even though explicitly calling this
stu_schema.methods.toJSON=function () {
    const student=this
    const stu_object=student.toObject()

    delete stu_object.password
    delete stu_object.tokens
    delete stu_object.file
    return stu_object
    
}


// methods used by instance
stu_schema.methods.getAuthToken= async function(){
    const student=this
    const token=await jwt.sign({_id:student._id.toString()},process.env.JWT_TOKEN)
    student.tokens=student.tokens.concat({token:token})
    await student.save()
    return token

}

//statics used by model
stu_schema.statics.findcredential=async(email,password)=>{
    const student=await stu_model.findOne({email:email})
    if(!student)
    {
        throw new Error('email id not matched')
    }
    const ismatch=await bcrypt.compare(password,student.password)
    if(!ismatch){
        throw new Error("password incorrect")
    }
    return student

}


//hasing password before saving "posting student data into mongodb" 
stu_schema.pre("save",async function(next){
    const student=this
    if(student.isModified('password')){
        student.password= await bcrypt.hash(student.password,8)
    }
    next()
})

stu_schema.pre("remove",async function(next){
   const student=this
   await hw_model.deleteMany({stu_id:student._id})
   next()
})

const stu_model=mongoose.model("student",stu_schema)
module.exports=stu_model