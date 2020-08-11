const chatInputChannel = document.querySelector('.chat-input-channel');
const chatInputText = document.querySelector('.chat-input-text');
const chatInputSubmit = document.querySelector('.chat-input-submit');
const chatContent = document.querySelector('.chat-chat');

let currentChannel = chatInputChannel.value;
let latestId = 1;

function connectChatServer(channel){
    fetch('/chat/connect',{
        method:'POST'
    }).then(function(res){
        return res.text();
    }).then(function(data){
        const parsedData = JSON.parse(data);
        latestId = parsedData.id;
        currentChannel = channel;
        chatContent.innerHTML += `<p>channel ${currentChannel} joined.</p>`
    });
}
function changeChannel(){
    chatInputChannel.value = Math.floor(chatInputChannel.value);
    if(chatInputChannel.value>0 && chatInputChannel.value != currentChannel){
        connectChatServer(chatInputChannel.value);
    }else{
        chatInputChannel.value = currentChannel;
    }
}
function chatSubmit(){
    chatUpdate();
    if(chatInputText.value != ''){
        const chatData = {
            channel : currentChannel,
            content : chatInputText.value
        }
        fetch('/chat/submit',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(chatData)
        }).then(function(res){
            return res.text();
        }).then(function(data){
            const parsedData = JSON.parse(data);
            chatInputText.value = '';
        });
    }
}
function chatUpdate(){
    const chatInfo = {
        id : latestId,
        channel : currentChannel
    };
    fetch('/chat/update',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(chatInfo)
    }).then(function(res){
        return res.text();
    }).then(function(data){
        const parsedData = JSON.parse(data);
        if(parsedData.chat.length !=0){
            parsedData.chat.forEach(function(chatting){
                chatContent.innerHTML += `<p>${chatting.username} : ${chatting.content}</p>`
            });
            latestId = parsedData.chat[parsedData.chat.length-1].id;
        }
    });
}

function init(){
    connectChatServer(currentChannel);
    chatInputChannel.addEventListener('blur',changeChannel);
    chatInputSubmit.addEventListener('click',chatSubmit);
    setInterval(chatUpdate,500);
}
init();