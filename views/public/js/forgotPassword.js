
    const forma=document.getElementById('resetEmail');

    forma.addEventListener('submit',resetPassword);
    
    async function resetPassword(e)
    {
        e.preventDefault();
        try
        {
            const email=document.getElementById('email').value;
            console.log(email);
            const x=await axios.post('http://localhost:3000/forgotpassword',{email})
            if(x.status === 200)
            { 
                alert('Reset link Has been sent to your registered Email');
            }else
            {
                alert('Email Not registered');
            }
    
        }
        catch(err){
            console.log(err);
        }
    }
    
    
  



