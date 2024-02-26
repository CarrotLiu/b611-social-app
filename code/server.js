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
let userNum = 0;
let allUsers = [];
let usersid = [];
let curRoom;
let rooms =[];
let curPos;
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
    userNum += 1;
    console.log(`${socket.id} connected`, userNum)
    //read data from firebase
    socket.on('initialize', (nm)=>{
        console.log(nm);
        userNum+=1;
        allUsers.push(`${socket.id}`)
        let room = findOrCreateRoom();
        
        if(nm){
            socket.emit('message', `Welcome to B611! ${nm}`)

        }else{
            socket.emit('message', `Welcome to B611! ${socket.id}`)
        }
        
        //send room and pos
        // socket.emit('getrmpos', {socketID:`${socket.id}`, room:curRoom, pos: curPos});

    })
    socket.on('login', (user)=>{
        socket.emit('message', `Welcome to B611! ${user}`)
        socket.broadcast.emit('message', `${user} connected`)
    })
    
    socket.on('disconnect', ()=>{
        socket.emit('bye', "disconnected")
        socket.broadcast.emit('bye', "disconnected")
        // let userToDelete = ;
        // allUsers = allUsers.filter(item => item !== userToDelete);
    })

    socket.on('activity', (name)=>{
        socket.broadcast.emit('activity', name)
    })
})

function findOrCreateRoom() {
    for (const room in rooms) {
        if (rooms[room].length < 2) {
            return room;
        }
    }
    
    const newRoom = `Room-${Object.keys(rooms).length + 1}`;
    rooms[newRoom] = [];
    return newRoom;
}