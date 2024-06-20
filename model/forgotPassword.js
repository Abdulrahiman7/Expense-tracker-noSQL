const mongoose = require("mongoose");
const { schema } = require("./user");
const Schema=mongoose.Schema;

const forgotPasswordSchema=new Schema({
    email:
    {
        type:String,
        required:true,
        ref:'User'
    },
    uuid:
    {
        type: String,
        default: null
    },
    active:
    {
        type: Boolean,
        default: false
    }
});



module.exports=mongoose.model('ForgotPassword',forgotPasswordSchema);