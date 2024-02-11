const socket = io('ws://localhost:3500')

function sendMessage(e) {
    e.preventDefault()
    const input = document.querySelector('input')
    if (input.value) {
        socket.emit('message', input.value)
        input.value = ""
    }
    input.focus()
}

document.querySelector('form')
    .addEventListener('submit', sendMessage)

// Listen for messages 
socket.on("message", (data) => {
    const li = document.createElement('li')
    li.textContent = data
    document.querySelector('ul').appendChild(li)
})

// Firebase initialization
const firebaseConfig = {
  apiKey: "AIzaSyCxkgwdNTOPwhosEk6zNwzXPqasIqIuhCY",
  authDomain: "b611-185f3.firebaseapp.com",
  projectId: "b611-185f3",
  storageBucket: "b611-185f3.appspot.com",
  messagingSenderId: "557411252910",
  appId: "1:557411252910:web:d84c2b9c084573f00a8b3f"

};

// firebase.initializeApp(firebaseConfig);
// const firestore = firebase.firestore();

// Handle User Input and Firebase Integration
function handleUserInput() {
  // Show input box using p5.js
  // Save user input to Firebase Firestore
}