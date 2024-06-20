document.getElementById('downloadExpense').addEventListener('click',expenseDownload);
const to=localStorage.getItem('token');
headers={
    'Authorization':to
}
async function expenseDownload(e)
{
    e.preventDefault();
    try{
        const x=await axios.get('http://localhost:3000/premium/download',{headers})
        console.log(x);
        if(x.status===200)
        {
            const a=document.createElement('a');
            
            a.download='myexpense.csv';
            a.type='text/csv';
            a.href=x.data.url;
            a.click();
        }else{
            throw new Error();
        }
    }
    catch(err){
        console.log(err);
    }
}
const ul=document.createElement('ul');
function displayPreviousDownloads(download)
{
    const li=document.createElement('li');
    const a=document.createElement('a');
    a.textContent=`${download.URL}`;
    a.href=`${download.URL}`;
    li.appendChild(a);
    ul.appendChild(li);
}


document.addEventListener('DOMContentLoaded',getContent);

async function getContent()
{
    try{
        const x=await axios.get('http://localhost:3000/premium/expenseReport',{headers});
        if(x.status===200)
        {
            const downloads=x.data.arr;
            for(let i=0;i<downloads.length;i++)
            {
                displayPreviousDownloads(downloads[i]);
            }
            document.getElementById('previous-downloads').appendChild(ul);
        }
    }
    catch(err){
        console.log(err);
    }
}