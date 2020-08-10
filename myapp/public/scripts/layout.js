const title = document.querySelector('header h1');
const indexLogined = document.querySelector('.logined');
const indexNotLogined = document.querySelector('.notLogined');
const indexUsername = document.querySelector('.username');

const INDEX_HIDE_CN = 'loginHide';

function init(){
    fetch('/users/login/query',{
        method:'POST'
    }).then(function(res){
        return res.text();
    }).then(function(data){
        const parsedData = JSON.parse(data);
        if(parsedData.login === true){
            //로그인됨
            indexUsername.innerHTML = parsedData.username;
            indexNotLogined.classList.add(INDEX_HIDE_CN);
        }else{
            //로그인안함
            indexLogined.classList.add(INDEX_HIDE_CN);
        }
    });
    title.addEventListener('click',function(){
        location.href="/";
    });
}
init();