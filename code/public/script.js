const socket = io('ws://localhost:3500')
const activity = document.querySelector('.activity')
const msgInput = document.querySelector('textarea')

function sendMessage(e) {
  e.preventDefault()
  if (msgInput.value) {
      socket.emit('message', msgInput.value)
      msgInput.value = ""
  }
  msgInput.focus()
}

// -------------------- CONNECTION ACTIVITY -------------------- //
socket.on("message", (msg) => {
  activity.textContent = `${msg}`; 
  clearEventMsg();
})

// -------------------- TYPING ACTIVITY -------------------- //
msgInput.addEventListener('keypress', () => {
  socket.emit('activity', socket.id.substring(0, 5))
})

let activityTimer;
socket.on("activity", (name) => {
  activity.textContent = `${name} is typing...`; 
  clearEventMsg();
})

function clearEventMsg(){
  clearTimeout(activityTimer)
    activityTimer = setTimeout(() => {
        activity.textContent = ""
    }, 3000)
}




