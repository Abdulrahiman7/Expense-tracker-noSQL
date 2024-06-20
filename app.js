const express=require('express');
const fs=require('fs');
const path=require('path');
const {mongoose}=require('mongoose');

const app= express();
require('dotenv').config();
const bodyParser=require('body-parser');
const cors=require('cors');
const userroute=require('./routers/userRoute');
const expenseroute=require('./routers/expenseRoute')
const orderroute=require('./routers/orderRoute');

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'views')));
app.use(userroute);
app.use(expenseroute);
app.use(orderroute);




async function connectToDatabase(){
    try{
      const dbConnect=mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster.cbjfzzk.mongodb.net/Expense-Tracker?retryWrites=true&w=majority&appName=Cluster`);
      app.listen(3000);
      console.log('app has started listening on port 3000');
    }catch(err)
    {
      console.log(err);
    }
  }
  
  connectToDatabase();
