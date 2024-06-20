const form=document.getElementById('form');

form.addEventListener('submit', loginUser);

async function loginUser(e)
{
    e.preventDefault();
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
    const newUser={
        'email':email,
        'password':password
    }
    try{
    const user=await axios.post('http://localhost:3000/login',newUser);
    if(user.status===200)
    {
        localStorage.setItem('token', user.data.token)
        window.location.href='http://127.0.0.1:5501/views/expense.html';
        document.getElementById('email').value='';
        document.getElementById('password').value='';
    }
    }
    catch(err){
        if(err.response.status === 404)
        {
          
            alert('email not found');
        }
        if(err.response.status === 403)
        {
            alert('incorrect password')
        }
        console.log(err)
    }
}