const express=require('express');
const {TokenAuthorization}= require('../middleware/token');
const router=express.Router();
const orderControl=require('../controllers/orderControl')
const cors=require('cors');
router.use(cors());

const Authorization=require('../middleware/token');

router.get('/order/buypremium',TokenAuthorization,orderControl.buyPremium);

router.post('/order/buystatus',TokenAuthorization,orderControl.orderStatus);


module.exports=router;