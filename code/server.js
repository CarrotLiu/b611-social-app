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
    console.log("socket connected");
    //user login
    socket.on('login', (userData)=>{
        userNum += 1;
        let others = userData[0].filter(data => data.displayName != userData[1]);
        let self = userData[0].filter(data => data.displayName == userData[1])[0];
        console.log(userData[0], userData);
        // allUsers.push(self.displayName)
        // socket.emit('checkUser', ()=>{
        //     console.log(self);
        //     return self
        // })
        socket.emit('checkUser', self)
        socket.emit('checkOthers', others)
        socket.emit('message', `Welcome to B611! ${self.displayName}`)
    })
    socket.on('visit', (visitor)=>{
        allUsers.push(visitor)
        socket.emit('message', `Welcome to B611!`)
        socket.emit('checkVisitor', visitor)
        
    })

    socket.broadcast.emit('message', `A Little Prince just arrived!`)

    // Enlarge canvas for more users
    socket.on('canvas', (cvwidth)=>{
        cvwidth += 100;
        socket.emit('canvas', cvwidth)
    })
    
    //update position
    socket.on('position', (pos)=>{
        // console.log(pos);
        io.emit('position', pos)
    })
    
    //user disconnect => delete prince
    socket.on('disconnect', (username)=>{
        userNum --;
        io.emit('bye', username) 
        socket.broadcast.emit('message', "A Little Prince just left" )
        allUsers = allUsers.filter(user => user != username);
    })

    //delete account => delete both prince and dandelion
    socket.on('delete', (username)=>{
        
    })
    console.log(`${socket.id} connected`, userNum)

    // //display event message
    // socket.on('activity', (name)=>{
    //     socket.broadcast.emit('activity', name)
    // })

    // socket.on('login', (user)=>{
    //     socket.emit('message', `Welcome to B611! ${user}`)
    //     socket.broadcast.emit('message', `${user} connected`)
    // })
})


