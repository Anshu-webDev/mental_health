
const chatInput = document.querySelector('.chat-input input');
const chatHistory = document.querySelector('.chat-history');

function addMessage(message, sender) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message');
    messageContainer.classList.add(`${sender}-message`);

    const messageText = document.createElement('p');
    messageText.textContent = message;

    messageContainer.appendChild(messageText);
    chatHistory.appendChild(messageContainer);
}

chatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const message = e.target.value;
        addMessage(message, 'user');
        e.target.value = '';
        setTimeout(function() {
            addMessage("I'm facing technical issues, please ask me later", 'bot');
        }, 1000);
    }
});


    function ChangeSendIcon(control) {
    if (control.value !== '') {
        document.getElementById('send').removeAttribute('style');
        document.getElementById('audio').setAttribute('style', 'display:none');
    }
    else {
        document.getElementById('audio').removeAttribute('style');
        document.getElementById('send').setAttribute('style', 'display:none');
    }
}
 
  const audioButton = document.getElementById('voice-input-button');
const audioIcon = document.getElementById('audio');
const sendIcon = document.getElementById('send');

let isRecording = false;

function startRecording() {
  navigator.mediaDevices.getUserMedia({ audio: true })
  .then(function(stream) {
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();
    isRecording = true;
    
    const audioChunks = [];
    mediaRecorder.addEventListener("dataavailable", event => {
      audioChunks.push(event.data);
    });
    
    mediaRecorder.addEventListener("stop", () => {
      const audioBlob = new Blob(audioChunks);
      const formData = new FormData();
      formData.append('audio', audioBlob);
      
      // Send audio data to server for processing and get text transcript
      
      // Create new message element with audio transcript
      const messageContainer = document.createElement('div');
      messageContainer.classList.add('message');
      messageContainer.classList.add('user-message');

      const audioPlayer = document.createElement('audio');
      audioPlayer.controls = true;
      audioPlayer.src = URL.createObjectURL(audioBlob);

      messageContainer.appendChild(audioPlayer);
      chatHistory.appendChild(messageContainer);
      
      isRecording = false;
      audioIcon.classList.remove('fa-stop');
      audioIcon.classList.add('fa-microphone');
      audioButton.disabled = false;
    });
    
    audioIcon.classList.remove('fa-microphone');
    audioIcon.classList.add('fa-stop');
    audioButton.removeEventListener('click', startRecording);
    audioButton.addEventListener('click', stopRecording);
    
    function stopRecording() {
  mediaRecorder.stop();
  audioButton.removeEventListener('click', stopRecording);
  audioButton.addEventListener('click', startRecording);

  setTimeout(function() {
    addMessage("I'm facing technical issues to process audio, So please ask me later", 'bot');
  }, 1000);
}
  })
  .catch(function(err) {
    console.error("Error starting audio recording", err);
  });
}

audioButton.addEventListener('click', startRecording);
