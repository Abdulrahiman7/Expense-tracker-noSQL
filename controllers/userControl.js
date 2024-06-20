const { default: mongoose } = require("mongoose");
const {hash, compare} =require('bcrypt');
const jwt= require('jsonwebtoken');
const User=require('../model/user');
const ForgotPassword=require('../model/forgotPassword');
const Sib=require('sib-api-v3-sdk');
const uuid=require('uuid');


function generateToken(id)
{
    const token= jwt.sign({userId:id},'secretkey');
    return token;
}
exports.createUser= async (req,res,next) => {
    try{
        const { name, email, password, number}= req.body;
    const checkExistingUser=await User.findOne(
        {
            $or:[
                {email: email} ,
                {number: number}
            ]
        });
    
    if(checkExistingUser !== null)
    {
       res.status(409).json({message: 'User already exists'});
    }else{
    const encodedPassword=hash(password, 10, async (err, hash)=>{
        if(err)
        {
            res.status(500).json({message: 'internal server error'});
        }else{
            const user=new User({
                name:name, 
                email:email, 
                password:hash, 
                number:number,
                premiumUser:{
                    orderId:null,
                    paymentId:null,
                    status:null
                },
                totalExpense:0,
            });
        await user.save();
        res.status(200).json(user);
        }
    });
}
}catch(err)
{
    console.log(err);
}
}

    

exports.loginUser=async (req,res, next)=> {
    try{
        const {email, password}=req.body;
        const isExistingUser=await User.findOne({email:email});
        if(isExistingUser)
        {
            const matchPassword=compare(password,isExistingUser.password)
            if(matchPassword){
                const token=jwt.sign(email, process.env.JWT_SECRET_KEY );
                res.status(200).json({token, email});

            }else res.status(401).json({message: 'incorrect password'});
        }else res.status(404).json({message: 'User not found'});
    }
    catch(err)
    {
        res.status(403).json({message: 'password incorrect'});
        console.log(err);
    }
}

exports.forgotUser= async (req,res,next)=>{
    const email=req.body.email;
try
{
    const client=Sib.ApiClient.instance;
    const apiKey=client.authentications['api-key'];
    apiKey.apiKey=process.env.BREVO_API_KEY;

const id=uuid.v4();
const createForgotPasswordRequest=new ForgotPassword({uuid:id, active:true, email:email});
await createForgotPasswordRequest.save();
const tranEmailApi=new Sib.TransactionalEmailsApi();
const sender={
    email:'abd27u@gmail.com'
}
const reciever=[
    {
        email:email
    }
];
console.log(id);
const resetLink=`http://localhost:3000/forgotpassword/${id}`;
console.log(resetLink);
await tranEmailApi.sendTransacEmail({
    sender,
    to:reciever,
    subject: 'RESET PASSWORD LINK',
    textContent:'Please do no share this link with anyone for security purpose',
    htmlContent:`<a href=${resetLink}>Click Here to reset your password</a>`
})
res.status(200).json({message: 'Reset Email sent Successfully'});


}
catch(err){
    console.log(err);
}
}

exports.postForgotUser=async (req, res , next) =>{
try{
    const id=req.params.id;
    console.log(id);
    const x=await ForgotPassword.findOne({uuid:id}); 
    if(x)
    {
        if(x.active == false)
    {
        console.log('entered false');
        res.status(204).json({message: 'Link has expired'});
    }else{

        x.active=false;
        await x.save();
        const token=generateToken(x.email);
        res.status(200).redirect(`http://localhost:3000/resetPassword.html?token=${token}`);
    }
    }
}
catch(err)
{
    console.log(err);
}
}

exports.changePassword= async (req, res, next) =>{
    
    const token=req.query.token;
    let email;
    jwt.verify(token,'secretkey',(err, decoded)=>{
        if(err)
        {
            console.log(err);
        }else{
            email=decoded.userId;
        }
    })
    hash(req.body.password, 10, async (err, hash) => {
        if (err) {
            
            console.error('Error hashing password:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            const user = await User.findOneAndUpdate({email:email},{password: hash });
            console.log('user is updated');
            res.status(200).json({message: 'successfully changed password'});
            // Handle bcrypt hashing errores.status(200).json(user);
        }
    })
}

