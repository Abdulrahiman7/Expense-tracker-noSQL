const mongoose = require("mongoose");
const Schema=mongoose.Schema;

const userSchema=new Schema({
    name:
    {
        type: String,
        required: true
    },
    email:
    {
        type:String,
        required:true,
        unique:true
    },
    password:
    {
        type:String,
        required: true
    },
    number:
    {
        type: Number,
        required: true,
        unique: true
    },
    premiumUser:
    {
        orderId: {
            type: String,
            default:null
        },
        paymentId: {
            type: String,
            default:null
        },
        status: {
            type: String,
            default:null

        }
    },
    totalExpense:
    {
        type:Number,
        required: true
    }
});

userSchema.methods.createOrder=async function(orderId, paymentStatus)
{
    try{
        console.log(orderId);
    this.premiumUser={orderId:`${orderId}`, paymentId:null, status:paymentStatus};
     await this.save();
     console.log(this.premiumUser);
}catch(err)
{
    console.log(err);
}
}

userSchema.methods.paymentStatus=async function(status, orderId, paymentId)
{
    try{
        this.premiumUser={orderId:orderId, paymentId:paymentId, status:status};
        return await this.save();
    }catch(err)
    {
        console.log(err);
    }
}

userSchema.methods.generateTotalExpense= async function(amount)
{
    try{
        this.totalExpense += +amount;
        return await this.save();
    }catch(err)
    {
        console.log(err);
    }
}
module.exports=mongoose.model('User',userSchema);