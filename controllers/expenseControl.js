
const mongoose=require('mongoose');
const Expense=require('../model/expenseModel');
const User=require('../model/user');


exports.postExpense=async (req, res, next)=> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try
    {  
        const exp=req.body;
        const userId=req.user._id;
        const newExpense=new Expense({...exp, 'userId':userId});
        await newExpense.save({session});
        await req.user.generateTotalExpense(exp.amount, {session}); 
        await session.commitTransaction();
        await session.endSession();
        res.status(200).json({});
    }
    catch(err)
    {
        await session.abortTransaction();
        await session.endSession();
        console.log(err);
        res.status(500).json({err})
    }
}

exports.getExpense=async (req, res, next)=>{
    try{
        const limitPage=req.query.pageLimit || 3;
        const page=req.query.page || 1;

        const offset=(page - 1) * limitPage;

        const expenseList = await Expense.find({'userId':req.user._id})
                                .skip(offset)
                                .limit(limitPage);

        const expenseListCount = await Expense.countDocuments({'userId':req.user._id});
        const totalPages=Math.ceil(expenseListCount/limitPage);
        let premiumUser;
        if(req.user.premiumUser && req.user.premiumUser.status==='SUCCESS')     premiumUser=true;
        else premiumUser=false;
        
        
	    res.status(200).json({exp:expenseList,prime:premiumUser,totalPages});
    }
    catch(err)
    {
        console.log(err);
    }
}


exports.deleteExpense= async (req,res,next) =>{
    const session=await mongoose.startSession();
    session.startTransaction();
    try{
        const id=req.params.id;
        console.log(id);
        const x=await Expense.findOneAndDelete({'_id':id},{session});
        const updateTotalExpense=await req.user.generateTotalExpense(-x.amount, {session});
        await session.commitTransaction();
        await session.endSession();
        res.status(200).json(null);
    }
    catch(err)
    {
        await session.abortTransaction();
        await session.endSession();
        console.log(err);
    }
}

