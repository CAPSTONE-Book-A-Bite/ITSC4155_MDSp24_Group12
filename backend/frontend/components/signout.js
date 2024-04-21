document.addEventListener("DOMContentLoaded", async () => {
    //change userName on the id logout-text
    if(document.cookie.includes('hostName')){
        document.getElementById('logout-text').innerHTML = `You have Logged out of<br>${document.cookie.split('; ').find(row => row.startsWith('hostName')).split('=')[1]}</br>`;
    }
    else{
        document.getElementById('logout-text').innerHTML = `You have Logged out of<br>${document.cookie.split('; ').find(row => row.startsWith('userName')).split('=')[1]}</br>`;
    }
    
    

    document.cookie = 'userId=; max-age=0';
    document.cookie = 'userName=; max-age=0';
    document.cookie = 'hostId=; max-age=0';
    document.cookie = 'hostName=; max-age=0';

}
);

document.querySelector('.sign-in').addEventListener('click', () => {
    window.location.href = '/login';
}
);
