

const Razorpay=require('razorpay');
const keyId=process.env.RAZORPAY_key_id;
const keySecret=process.env.RAZORPAY_key_secret;

exports.buyPremium= async (req,res,next)=> {
    console.log('entered the buy Premium')
    try{
    const rzp=new Razorpay({
        key_id: keyId,
        key_secret: keySecret
    })
    const amt=2400;
    rzp.orders.create({amount:amt,currency:'INR'},async (err, order)=>{
        if(err)
        {
            throw new Error(err);
        }
    await req.user.createOrder(order.id, 'PENDING');
    return res.status(201).json({order_id: order.id, key_id:rzp.key_id});

    })
}catch(err){
    console.log(err);
    
}
}

exports.orderStatus= async (req,res, next)=>{
    try{
        console.log('entered the status')
        const {status , order_id, payment_id}=req.body;
        await req.user.paymentStatus(status, order_id, payment_id)
        
        if(req.body.status === 'SUCCESS')
        {
            res.status(200).json({success: true});
        }else res.status(204).json({success: false});
        
    }
catch(err){
    console.log(err);

}
}