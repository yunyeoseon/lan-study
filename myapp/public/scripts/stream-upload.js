const player = document.querySelector('.player');

function handleSuccess(stream){
    const options = {
        mimeType: 'video/webm'
        };
    const mediaRecorder = new MediaRecorder(stream,options);

    mediaRecorder.addEventListener('dataavailable', function(e) {
        if (e.data.size > 0) {
            // e.data = blob
            fetch('/stream/upload',{
                method:'POST',
                body: e.data
            }).then(function(res){
                // do something
            });
        }
    });
    mediaRecorder.start(5000);
}

function init(){
    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    .then(handleSuccess);

}

init();