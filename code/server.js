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
let allUsers = []; // 所有在线的人的data（包含在在线的visitor和user）
let userX = {}; // 所有在线的人的 x position
let userNum = allUsers.length;

//Establish socket server API
//if in production mode: route to github path. else, route to local path
const io = new Server(expressServer, {
    cors: {
        origin: process.env.NODE_ENV === "production" ? "https://carrotliu.github.io" : 
        ["http://localhost:5501", "http://127.0.0.1:5501"]
    }
})

// connect socket
io.on('connection', socket => {
    console.log("socket connected");
    //user login
    socket.on('login', (userData)=>{
        // userData[0] = userList; 已经写入了新user
        // userData[1] = userId;
        // userData[2] = "visitor" / "user";
        let others = allUsers; //需要所有在线users但不包含当前user，但如果是同一个user打开两个tab就会包含当前user
        let self = userData[0].filter(data => data.userId == userData[1])[0];//当前的user
        let otherFlowers = userData[3].filter(data=>data.userId != userData[1]);//db里所有除self外的user
        socket.id = self.displayName;
        
        if(userData[2] == "user"){
            let allUserIds = [];
            for(let user in allUsers){
                allUserIds.push(user.userId);
            }
            //如果当前user只登陆了一个tab：
            if(!allUserIds.includes(self.userId)){
                allUsers.push(self);
                userX[self.displayName]=self.myX + 200;  
                socket.broadcast.emit('message', `A Little Prince just arrived!`)
                socket.emit('message', `Welcome to B611! ${self.displayName}`)

            }else{ //如果当前user打开了多个tab：
                //把当前user从others里去掉
                others = allUsers.filter(data => data.userId != self.userId);
            }
            
            
        }else if(userData[2] == "visitor"){
            allUsers.push(self)
            socket.broadcast.emit('message', `A Little Prince just arrived!`)
            socket.emit('message', `Welcome to B611!`)
            
        }
        userNum = allUsers.length;
        others = allUsers.filter(data => data.userId != self.userId);
        socket.emit('checkSelf', self)
        socket.emit('otherFlower', otherFlowers)
        socket.emit('checkOthers', [others, userX])
        console.log(`${socket.id} connected`, userNum)
        socket.broadcast.emit('newOthers', self)
        
    })
    
    
    //update position
    socket.on('updatePos',(posDt)=>{
        userX[posDt[0]] = posDt[1];
        console.log(userX);
        socket.broadcast.emit('getPos', userX);
    })

    

    
    //user disconnect => delete prince
    socket.on('disconnect', ()=>{
        io.emit('bye', socket.id) 
        console.log(socket.id)
        socket.broadcast.emit('message', "A Little Prince just left" )
        allUsers = allUsers.filter(user => user.displayName != socket.id);
    })


    

    // //display event message
    // socket.on('activity', (name)=>{
    //     socket.broadcast.emit('activity', name)
    // })

    // socket.on('login', (user)=>{
    //     socket.emit('message', `Welcome to B611! ${user}`)
    //     socket.broadcast.emit('message', `${user} connected`)
    // })
})


