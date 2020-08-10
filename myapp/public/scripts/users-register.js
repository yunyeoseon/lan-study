const registerForm = document.querySelector('.js-registerForm');
const username = registerForm.querySelector('.rg-username');
const password = registerForm.querySelector('.rg-password');
const confirmpw = registerForm.querySelector('.rg-confirm');
const userDuplicated = registerForm.querySelector('.err-username-duplicated');
const userManyChars = registerForm.querySelector('.err-username-toomanychars');
const pwFewChars = registerForm.querySelector('.err-password-toofewchars');
const confirmNotMatch = registerForm.querySelector('.err-confirm-notMatch');
const submit = registerForm.querySelector('.rg-submit');
const cancel = registerForm.querySelector('.rg-cancel');

const HIDE_CN = 'hide';
const DISABLED_BTN_CN = 'disabledBtn';

// 올바른 회원가입 입력인지 확인. 모두 false이면 정상적인 입력
let validUserData = {
    duplicated:true,
    usernameMany:true,
    passwordFew:true,
    confirmNotMatch:true
}
// 닉네임 중복
function checkDuplicated(){
    // 서버에 보낼 객체 생성
    let usernameCheck = {
        username : username.value
    };
    // 서버에 전송
    fetch('/users/register/duplicate',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usernameCheck)
    }).then(function(res){
        return res.text();
    }).then(function(data){
        const parsedData = JSON.parse(data);
        if(parsedData.duplicated === false){
            userDuplicated.classList.add(HIDE_CN);
            validUserData.duplicated = false;
        }
        else{
            userDuplicated.classList.remove(HIDE_CN);
            validUserData.duplicated = true;
        }
    });
}
// 닉네임 20자 초과
function checkTooManyChar(){
    if(username.value.length > 20){
        userManyChars.classList.remove(HIDE_CN);
        validUserData.usernameMany = true;
    }
    else{
        userManyChars.classList.add(HIDE_CN);
        validUserData.usernameMany = false;
    }
}
// 비밀번호 8자 미만
function checkTooFewChar(){
    if(password.value.length < 8){
        pwFewChars.classList.remove(HIDE_CN);
        validUserData.passwordFew = true;
    }
    else{
        pwFewChars.classList.add(HIDE_CN);
        validUserData.passwordFew = false;
    }
}
// 비밀번호 확인 불일치
function checkMatch(){
    if(password.value != confirmpw.value){
        confirmNotMatch.classList.remove(HIDE_CN);
        validUserData.confirmNotMatch = true;
    }
    else{
        confirmNotMatch.classList.add(HIDE_CN);
        validUserData.confirmNotMatch = false;
    }
}
function submitBtnActivate(){
    if(
        validUserData.confirmNotMatch===false &&
        validUserData.usernameMany===false &&
        validUserData.duplicated===false &&
        validUserData.passwordFew===false
    ){
        submit.classList.remove(DISABLED_BTN_CN);
    }
}

function init(){
    submit.addEventListener('click',function(){
        if(
            validUserData.confirmNotMatch===false &&
            validUserData.usernameMany===false &&
            validUserData.duplicated===false &&
            validUserData.passwordFew===false
        ){
            // 서버에 보낼 객체 생성
            let registerData = {
                username : username.value,
                password : password.value
            };
            // 서버에 전송
            fetch('/users/register/confirm',{
                method:'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registerData)
            }).then(function(res){
                return res.text();
            }).then(function(data){
                const parsedData = JSON.parse(data);
                if(parsedData.registered === true){
                    alert(`${username.value} 회원가입 성공!`);
                    location.href="/users/login";
                }
            });
        }
    });
    cancel.addEventListener('click',function(){
        location.href="/users/login";
    });
    username.addEventListener('blur',function(){
        if(username.value != ''){
            checkTooManyChar();
            if(validUserData.usernameMany===false){
                checkDuplicated();
            }
        }
        submitBtnActivate();
    });
    password.addEventListener('blur',function(){
        if(password.value != ''){
            checkTooFewChar();
            if(confirmpw.value != ''){
                checkMatch();
            }
        }
        submitBtnActivate();
    });
    confirmpw.addEventListener('blur',function(){
        if(confirmpw.value != ''){
            checkMatch();
        }
        submitBtnActivate();
    });
}

init();