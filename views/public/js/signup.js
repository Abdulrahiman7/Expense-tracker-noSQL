const form=document.getElementById('form');

form.addEventListener('submit', createUser);

async function createUser(e)
{
    e.preventDefault();
    const name=document.getElementById('name').value;
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
    const number=document.getElementById('number').value;
    const newUser={
        'name':name,
        'email':email,
        'password':password,
        'number':number
    }
    try{
        console.log('ent')
    const user=await axios.post('http://localhost:3000/signup',newUser);
    if(user.status===200)
    {
        console.log('good');
        window.location.href='http://localhost:3000/login.html';
    }
    if(user.status === 208)
    {
      
        alert('email already exists');
    }
    if(user.status === 204)
    {
        alert('Please fill all fields')
    }
    }
    catch(err){
        console.log(err)
    }
}