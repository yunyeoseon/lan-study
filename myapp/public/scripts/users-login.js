const loginForm = document.querySelector('.js-loginForm');
const username = loginForm.querySelector('.lg-username');
const password = loginForm.querySelector('.lg-password');
const loginError = loginForm.querySelector('.lg-err');
const submit = loginForm.querySelector('.lg-submit');

const HIDE_CN = 'hide';

function init(){
    submit.addEventListener('click',function(){
        let loginData = {
            username : username.value,
            password : password.value
        };
        fetch('/users/login/confirm',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        }).then(function(res){
            return res.text();
        }).then(function(data){
            const parsedData = JSON.parse(data);
            if(parsedData.login === false){
                loginError.classList.remove(HIDE_CN);
            }else{
                location.href="/";
            }
        });
    });
}

init();