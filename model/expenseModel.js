const mongoose = require("mongoose");
const Schema=mongoose.Schema;

const expenseSchema=new Schema({
    amount:
    {
        type: Number,
        required: true
    },
    description:
    {
        type: String,
        required: true
    },
    category:
    {
        type: String,
        required: true
    },
    userId:
    {
        type: Schema.ObjectId,
        required: true,
        ref: 'User'
    }
});


module.exports=mongoose.model('Expense',expenseSchema);