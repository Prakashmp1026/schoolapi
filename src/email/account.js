const sgmail=require('@sendgrid/mail')
//const sendgridAPIKey='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'
sgmail.setApiKey(process.env.SENDGRID_APIKEY)
const sendemailopen=(email,name)=>{
    sgmail.send({
        to:email,
        from:'iammp100@gmail.com',
        subject:'account open',
        text:`Hi ${name}thanks for openning an account :)`
    })
}
const sendemailclose=(email,name)=>{
    sgmail.send({
        to:email,
        from:'iammp100@gmail.com',
        subject:'closing an account',
        text:`Hi ${name}!! \n thanks for used our account `
    })
}
module.exports={
    sendemailopen,
    sendemailclose
}
