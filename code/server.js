import express from "express"
import { Server } from "socket.io"
import path from "path"
import { fileURLToPath } from 'url'

// ---------------------- EXPRESS SERVER ---------------------- //
//devine port & directories
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PORT = process.env.PORT || 3500
//create an express app
const app = express()

//user: the middleware function is executed when the base of the requested path matches path.
//static: load the static files in the "public" folder
app.use(express.static(path.join(__dirname, "public")))

//Binds and listens for connections on the specified host and port.
const expressServer = app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})


// ---------------------- SOCKET ---------------------- //
//Establish socket server API
//if in production mode: route to github path. else, route to local path
const io = new Server(expressServer, {
    cors: {
        origin: process.env.NODE_ENV === "production" ? "https://carrotliu.github.io" : 
        ["http://localhost:5500", "http://127.0.0.1:5500"]
    }
})


// connect socket
io.on('connection', socket => {
    console.log(`User ${socket.id} connected`)

    //upon connection
    //send the message to only the user
    socket.emit('message', "Welcome to B611!")

    //send the message to all others
    socket.broadcast.emit('message', `User ${socket.id.substring(0, 5)} connected`)

    //listen for message event
    socket.on('message', data => {
        io.emit('message', `${socket.id.substring(0, 5)}: ${data}`)
    })

    //when user disconnects, notify all other users
    socket.on('disconnect', ()=>{
        socket.broadcast.emit('message', `User ${socket.id.substring(0, 5)} disconnected`)
    })

    //listen for activity
    socket.on('activity', (name)=>{
        socket.broadcast.emit('activity', name)
    })
})


// ---------------------- DATABASE ---------------------- //
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