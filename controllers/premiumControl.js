const Expense=require('../model/expenseModel');
const User=require('../model/user');
const AwsServices=require('../services/awsServices');
const Download=require('../model/download');


exports.getLeaderboard= async (req, res, next)=>{
  try{
    const usersLeaderboard = await User.find({})
                                  .select('email name totalExpense')
                                  .sort({'totalExpense': -1});
    
  
    res.status(200).json({ arr: usersLeaderboard });
  }
    catch(err){
      res.status(404).json({message: 'internal server error'});
    }
      
}

exports.getReport=async (req, res, next)=>{
  try{
    const downloads=await Download.find({userId: req.user._id});
  
    res.status(200).json({ arr: downloads });
  }
    catch(err){
      res.status(404).json({message: 'internal server error'});
    }
}
exports.downloadExpense= async (req, res, next)=>{
  try{
    const expenses=await Expense.find({userId:req.user._id});
   const stringifiedExpense=JSON.stringify(expenses);
   const fileName= `${req.user.email}/${new Date()}.txt`;
   const bucketName='expense-tracker-v02';
   const fileURL=await AwsServices.uploadToS3(stringifiedExpense, fileName, bucketName);
   const x=await Download.create({URL:fileURL, userId:req.user._id});
   if(x)
   {
    console.log('download created successfully');
   }
   res.status(200).json({url:fileURL});
  }
  catch(err)
  {
    console.log(err);
  }
}
