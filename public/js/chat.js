const chatInput = document.querySelector('.chat-input input');
const chatHistory = document.querySelector('.chat-history');

/// List of questions
let questions = [
  "Hello! How are you feeling today?",
  "Over the past two weeks, how often have you had little interest or pleasure in doing things?",
  "Over the past two weeks, how often have you felt down, depressed, or hopeless?",
  "Over the past two weeks, how often have you had trouble falling or staying asleep, or sleeping too much? ",
  "Over the past two weeks, how often have you felt tired or had little energy?",
  "Over the past two weeks, how often have you had a poor appetite or overeaten? ",
  "Over the past two weeks, how often have you felt like a failure or let yourself or your family down?",
  "Over the past two weeks, how often have you had trouble concentrating on things like reading the newspaper or watching TV?",
  "Over the past two weeks, how often have you been moving or speaking so slowly that other people could have noticed?",
  "Thanks for giving the assessment 😊"
];


// counting the current question number
let currentQuestionIndex = 0;


// Asking question


function askQuestion() {
    if (currentQuestionIndex >= questions.length) {
        return;
    }

    const question = questions[currentQuestionIndex];
    addMessage(question, 'bot');
    currentQuestionIndex++;
}



setTimeout(function() {
  askQuestion();
}, 500);

/// Adding message 
function addMessage(message, sender) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message');
    messageContainer.classList.add(`${sender}-message`);

    const messageText = document.createElement('p');
    messageText.textContent = message;

    messageContainer.appendChild(messageText);
    chatHistory.appendChild(messageContainer);
}

const audioButton = document.getElementById('voice-input-button');
const audioIcon = document.getElementById('audio');
const sendIcon = document.getElementById('send');

let isRecording = false;


let rec = null;
let audioStream = null;

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


    // old start
    let constraints = { audio: true, video: false }

    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        const audioContext = new window.AudioContext();
        audioStream = stream;
        const input = audioContext.createMediaStreamSource(stream);
        rec = new Recorder(input, { numChannels: 1 })
        rec.record()
        
    }).catch(function (err) {
        console.log(err);
    });
    // old over
    
    mediaRecorder.addEventListener("stop", () => {

      // old start
      rec.stop();
      audioStream.getAudioTracks()[0].stop();
      rec.exportWAV(uploadSoundData);

      function uploadSoundData(blob) {
        const nowUtc = new Date(Date.now());
        const filename = "audio" + nowUtc.toISOString().replaceAll(":", "-") + ".wav";
        const formData = new FormData();
        formData.append('audio', blob, filename);

        fetch("http://localhost:3000/send_audio", {
          method: "POST",
          body: formData
        }).then(async result=>{
          console.log("success");
        }).catch(error=>{
          console.log(error);
        })

    }
      // old over
      
      const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' }); // Set the mimeType to 'audio/mp3'
      
      // Send audio data to server for processing and get text transcript
      console.log(audioBlob);
      // Create new message element with audio transcript
      const messageContainer = document.createElement('div');
      messageContainer.classList.add('message');
      messageContainer.classList.add('user-message');

      const audioPlayer = document.createElement('audio');
      audioPlayer.controls = true;
      audioPlayer.src = URL.createObjectURL(audioBlob);
      console.log(audioPlayer);

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
        askQuestion();
      }, 1000);
    }
  })
  .catch(function(err) {
    console.error("Error starting audio recording", err);
  });
}



// function startRecording() {
//   navigator.mediaDevices.getUserMedia({ audio: true })
//   .then(function(stream) {
//     const mediaRecorder = new MediaRecorder(stream);
//     mediaRecorder.start();
//     isRecording = true;
    
//     const audioChunks = [];
//     mediaRecorder.addEventListener("dataavailable", event => {
//       audioChunks.push(event.data);
//     });
    
//     mediaRecorder.addEventListener("stop", () => {
//       const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' }); // Set the mimeType to 'audio/mp3'
//       const nowUtc = new Date(Date.now());
//       // console.log(nowUtc.toISOString());
//       const filename = "audio" + nowUtc.toISOString().replaceAll(":", "-") + ".mp3";
//       const formData = new FormData();
//       formData.append('audio', audioBlob, filename);

//       fetch("http://localhost:3000/send_audio", {
//         method: "POST",
//         body: formData
//       }).then(async result=>{
//         console.log("success");
//       }).catch(error=>{
//         console.log(error);
//       })
      
//       // Send audio data to server for processing and get text transcript
//       console.log(audioBlob);
//       // Create new message element with audio transcript
//       const messageContainer = document.createElement('div');
//       messageContainer.classList.add('message');
//       messageContainer.classList.add('user-message');

//       const audioPlayer = document.createElement('audio');
//       audioPlayer.controls = true;
//       audioPlayer.src = URL.createObjectURL(audioBlob);
//       console.log(audioPlayer);

//       messageContainer.appendChild(audioPlayer);
//       chatHistory.appendChild(messageContainer);
      
//       isRecording = false;
//       audioIcon.classList.remove('fa-stop');
//       audioIcon.classList.add('fa-microphone');
//       audioButton.disabled = false;
//     });
    
//     audioIcon.classList.remove('fa-microphone');
//     audioIcon.classList.add('fa-stop');
//     audioButton.removeEventListener('click', startRecording);
//     audioButton.addEventListener('click', stopRecording);
    
//     function stopRecording() {
//       mediaRecorder.stop();
//       audioButton.removeEventListener('click', stopRecording);
//       audioButton.addEventListener('click', startRecording);

//       setTimeout(function() {
//         askQuestion();
//       }, 1000);
//     }
//   })
//   .catch(function(err) {
//     console.error("Error starting audio recording", err);
//   });
// }


audioButton.addEventListener('click', startRecording);



