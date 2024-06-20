const Expensecontrol=require('../controllers/expenseControl');
const Premiumcontrol=require('../controllers/premiumControl');
const express=require('express');
const router=express.Router();

const cors=require('cors');
router.use(cors());

const {TokenAuthorization}=require('../middleware/token');


router.post('/expense',TokenAuthorization,Expensecontrol.postExpense);

router.get('/expense',TokenAuthorization,Expensecontrol.getExpense);

router.delete('/expense/:id',TokenAuthorization,Expensecontrol.deleteExpense);

router.get('/premium/leaderboard',TokenAuthorization,Premiumcontrol.getLeaderboard);

router.get('/premium/expenseReport',TokenAuthorization,Premiumcontrol.getReport);

router.get('/premium/download',TokenAuthorization, Premiumcontrol.downloadExpense);
module.exports= router;