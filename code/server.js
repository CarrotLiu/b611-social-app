import express from "express"                  
import { Server } from "socket.io"
import path from "path"
import { fileURLToPath } from 'url'

// ---------------------- EXPRESS SERVER ---------------------- //
//define port & directories
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PORT = process.env.PORT || 3500
//create an express app
const app = express()


//user: the middleware function is executed when the base of the requested path matches path.
//static: load the static files in the "public" folder
const publicDir = path.join(__dirname, "public")
app.use(express.static(publicDir))



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
    console.log(`${socket.id} connected`)



    //read data from firebase
    socket.on('initialize', (dt)=>{
        console.log(dt);
        //send the message to only the user
        socket.emit('message', {texts: "Welcome to B611!", user: `${socket.id}`})
        //send the message to the other user
        socket.broadcast.emit('message', {texts:`${socket.id.substring(0, 5)} connected`, user: `${socket.id}`})

    })

    //when user disconnects, notify the other user
    socket.on('disconnect', ()=>{
        socket.broadcast.emit('message', {texts: `${socket.id.substring(0, 5)} disconnected`, user: `${socket.id}`})
    })

    //listen for activity
    socket.on('activity', (name)=>{
        socket.broadcast.emit('activity', name)
    })
})