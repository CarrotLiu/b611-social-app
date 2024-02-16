import express from "express"                  
import { Server } from "socket.io"
import path from "path"
import { fileURLToPath } from 'url'
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";


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
app.get('/', (req, res)=>{
    res.sendFile(path.join(publicDir, "/startpg"))
}) 

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

    //upon connection
    //send the message to only the user
    socket.emit('message', {texts: "Welcome to B611!", user: `${socket.id}`})

    //send the message to the other user
    socket.broadcast.emit('message', {texts:`${socket.id.substring(0, 5)} connected`, user: `${socket.id}`})

    //when user disconnects, notify the other user
    socket.on('disconnect', ()=>{
        socket.broadcast.emit('message', {texts: `${socket.id.substring(0, 5)} disconnected`, user: `${socket.id}`})
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

const provider = new GoogleAuthProvider();
const fireApp = initializeApp(firebaseConfig)
const db = getFirestore(fireApp);
const auth = getAuth(fireApp);
// const firestore = firebase.firestore();

signInWithPopup(auth, provider)
  .then((result) => {
    // Get Google Access Token to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info. (IdP data available using getAdditionalUserInfo(result))
    const user = result.user;
  }).catch((error) => {
    // Handle Errors
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    
  });


function getDBReference(refName) {
    let ref = database.ref(refName);
    // RefVal.push(ref);
    // event listeners
    ref.on("child_added", data => {
      console.log("!DB ADDED");
      console.log(data.key);
      console.log(data.val());
      let Value = data.val();

      if (data.key == "user") {
        for (key in Value) {
          user.push(Value[key]);
          TextL.push(key);
        }
      } else if (data.key == "coreData") {
        for (key in Value) {
          coreData.push(Value[key]);
          TextT.push(key);
        } 
      }else if(data.key == "seedData"){
            
      }
      processData();
    });
  
    // console.log(ActivityL.length, ActivityT.length);
    ref.on("child_removed", data => {
      console.log("!DB REMOVED");
      console.log(data.key);
      console.log(data.val());
    });
    ref.on("child_changed", data => {
      console.log("!DB CHANGED");
      console.log(data.key);
      console.log(data.val());
    });
    ref.on("child_moved", data => {
      console.log("!DB MOVED");
      console.log(data.key);
      console.log(data.val());
    });
    return ref;
  }
  
  function clearDBReference(refName) {
    let ref = database.ref(refName);
  
    // clear out the previous data in the key
    ref
      .remove()
      .then(function() {
        console.log("! DB Remove succeeded.");
      })
      .catch(function(error) {
        console.log("! DB Remove failed: " + error.message);
      });
  }