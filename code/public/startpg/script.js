const socket = io('ws://localhost:3500')
const loginBtn = document.querySelector("#login")
const visitBtn = document.querySelector("#visit")
loginBtn.addEventListener('click', () => {
    socket.emit('login', socket.id.substring(0, 5))
})
visitBtn.addEventListener('click', () => {
    window.location.href = "../app"
})
