const Usercontrol=require('../controllers/userControl');
const express=require('express');
const router=express.Router();

const cors=require('cors');
router.use(cors());

router.post('/signup',Usercontrol.createUser);

router.post('/login',Usercontrol.loginUser);

router.post('/forgotpassword',Usercontrol.forgotUser);

router.get('/forgotpassword/:id',Usercontrol.postForgotUser);

router.post('/changepassword',Usercontrol.changePassword);
module.exports= router;