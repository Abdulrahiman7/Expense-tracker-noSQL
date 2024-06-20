



const form=document.getElementById('form');
const to=localStorage.getItem('token')
    const headers={
        'Authorization':to
    }

form.addEventListener('submit', createExpense);

async function createExpense(e)
{
    e.preventDefault();
    const amt=document.getElementById('amount').value;
    const des=document.getElementById('description').value;
    const cat=document.getElementById('category').value;
    const newExpense={
        'amount':amt,
        'description':des,
        'category':cat
    }
    try{
        
       
    const user=await axios.post('http://localhost:3000/expense',newExpense,{headers});
    if(user.status===200)
    {
        console.log('good');
        window.location.reload();
    }
    }
    catch(err){
        console.log(err)
    }
}
const ul=document.createElement('ul');


function display(id, amt, des, cat)
{
    
    const li=document.createElement('li');
    li.setAttribute('id',id);
    const text=document.createTextNode('amount='+amt+', description='+des+', category:'+cat);
    const del=document.createElement('button');
    del.textContent= 'delete';
    li.appendChild(text);
    li.appendChild(del);
    ul.appendChild(li);

    del.addEventListener('click',deleteExpense);
}

async function deleteExpense(e)
{
    e.preventDefault();
    const id=this.parentElement.id;
  
    try{
        const x=await axios.delete(`http://localhost:3000/expense/${id}`,{headers})
        if(x.status===200)
        {
            console.log('deleted');
            window.location.reload();
        }
    }
    catch(err){
        console.log(err);
    }
}

document.getElementById('buy').onclick= async function(e){
    e.preventDefault();
    try{
        const x=await axios.get('http://localhost:3000/order/buypremium',{headers})
        console.log(x.Razorpay);
        var options={
            'key': x.data.key_id,
            'order_id':x.data.order_id,
            'handler': 
            async function(x){
                await axios.post('http://localhost:3000/order/buystatus',{
                    order_id:options.order_id,
                    payment_id:x.razorpay_payment_id,
                    status: 'SUCCESS'
                }, {headers:headers})
                alert('you are now a premium number');
            }
            }
            const rzp1=new Razorpay(options);
            rzp1.open();
            e.preventDefault();

            rzp1.on('payment.failed', function(er){
                 axios.post('http://localhost:3000/order/buystatus',{
                    order_id:options.order_id,
                    payment_id:x.razorpay_payment_id,
                    status: 'FAILED'
                }, {headers:headers});
                alert('something went wrong with payment');
            })
            
    }
    catch(err){
        console.log(err);
    }
}
let leaderboardVisible=false;

async function showLeaderboard(e)
{
    e.preventDefault();
    const ul=document.createElement('ul');
    const premiumSpace=document.getElementById('leaderboard-list');
    if(leaderboardVisible==true)
    {
        document.getElementById('leaderboard-list').innerHTML='';
        
        leaderboardVisible=false;
        return;
    }else{
    premiumSpace.style.display='block';
    
    try{
        const x=await axios.get('http://localhost:3000/premium/leaderboard',{headers})
       
       
        for(let i=0;i<x.data.arr.length;i++)
        {
            const li=document.createElement('li');
            const text=document.createTextNode(i+1+' =>'+x.data.arr[i].name+' Total Expense: '+x.data.arr[i].totalExpense);
            li.appendChild(text);
            ul.appendChild(li);
            
        }
        premiumSpace.appendChild(ul);
        leaderboardVisible=true;
        
    }
    catch(err){
        console.log(err);
    }
}
}

function reportPage(e)
{
    e.preventDefault();
    window.location.href='../views/expensePage.html';
}

function isPremiumUser()
{
    const premiumSpace=document.getElementById('buydiv');
    premiumSpace.innerHTML='';
    const buyDiv=document.getElementById('buy');
    if(buyDiv)
    {
        premiumSpace.removeChild(buyDiv);
    }
        const text=document.createTextNode('You are a Premium User');
        const button=document.createElement('button');
        button.setAttribute('id','leaderboard');
        button.textContent='Leaderboard';
        premiumSpace.appendChild(text);
        premiumSpace.appendChild(button);
        button.addEventListener('click',showLeaderboard);

        const dayToday=document.createElement('button');
        dayToday.textContent= 'Daily Expense Report';
        premiumSpace.appendChild(dayToday);
        dayToday.addEventListener('click',reportPage);

}
const pageList=document.getElementById('page-list');
const page_Limit=document.getElementById('page-Limit');

page_Limit.addEventListener('change',setPageLimit);

function setPageLimit(e)
{
    e.preventDefault();
    const limitValue=page_Limit.value;
    localStorage.setItem('expenseLimit',limitValue);
    getExpense(1);
}

function gotoPage(e)
{
    console.log('goto page entered');
    e.preventDefault();
    const page=this.textContent;
    getExpense(+page);
}

async function pageButtons(length)
{
    pageList.innerHTML='';
    for(let i=0;i<length;i++)
    {
        const pageNo=document.createElement('button');
        pageNo.textContent=`${i+1}`;
        pageNo.setAttribute('id',`${i+1}`);
        pageList.appendChild(pageNo);
        pageNo.addEventListener('click',gotoPage)
    }
}

document.addEventListener('DOMContentLoaded',()=>{
    getExpense(1);
});

async function getExpense(page)
{
    try{
        const pageLimit=localStorage.getItem('expenseLimit')||2;
        page_Limit.value=pageLimit;
        const y=await axios.get(`http://localhost:3000/expense?page=${page}&pageLimit=${pageLimit}`,{headers});
        if(y.status=== 200)
        {
            
            console.log(y.data.prime);
            const z=y.data.exp;
            if(y.data.prime===true)
            {
                isPremiumUser();
            }
            
            ul.innerHTML='';
            for(let i=0;i<z.length;i++)
            {
                display(z[i]._id, z[i].amount, z[i].description, z[i].category);
            }
            pageButtons(y.data.totalPages);
        }
    }
    catch(err){
        console.log(err);
    }
}

const list=document.getElementById('expense-list');
list.appendChild(ul);