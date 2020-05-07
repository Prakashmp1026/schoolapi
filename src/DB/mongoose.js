 const mongoose=require('mongoose')
 
  mongoose.connect(process.env.MONGOOSE_URL,{ 
     useNewUrlParser:true,
     useCreateIndex:true,
     useUnifiedTopology: true
    },(error)=>{
        if(error){return console.log("DB not Connected")}
        console.log('db connected!!')
    })
