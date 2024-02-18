// import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
// import { getDatabase, ref, set, push, onValue, onChildAdded, onChildChanged, onChildRemoved} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
// import { getAuth, getRedirectResult, signOut, signInWithPopup, signInWithRedirect, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
// let firebase = require('https://www.gstatic.com/firebasejs/10.8.0/firebase.js');
// Firebase initialization
const firebaseConfig = {
    apiKey: "AIzaSyCxkgwdNTOPwhosEk6zNwzXPqasIqIuhCY",
    authDomain: "b611-185f3.firebaseapp.com",
    projectId: "b611-185f3",
    storageBucket: "b611-185f3.appspot.com",
    messagingSenderId: "557411252910",
    appId: "1:557411252910:web:d84c2b9c084573f00a8b3f",
    databaseURL: "https://b611-185f3-default-rtdb.firebaseio.com/"
};

const loginBtn = document.querySelector("#login");
const visitBtn = document.querySelector("#visit");

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const dbRef = db.ref("userData");

let userNum = 0;
let userList = [];
let userData={};
let data_loaded = false;
let if_set = true;
let write_done = false;
function processData() {
    if (userList.length == 0) {
      return;
    }
    data_loaded = true;
  }

//Read Data
function readUserData(username){
    dbRef.on("child_added", (snapshot) => {
        console.log("!DB ADDED");
        console.log(snapshot.key);
        console.log(snapshot.val());
        
        let Value = snapshot.val();
        userList=Object.values(Value);
        
        for(let i = 0; i < userList.length; i++){
            if (userList[i].displayName == username) {
                if_set = false;
            } 
        }
        // Value.sort(function(a, b) {
        //   return a.value - b.value;
        // });
        // if (snapshot.key == "ActivityL") {
        //   for (key in Value) {
        //     ActivityL.push(Value[key]);
        //     TextL.push(key);
        //   }
        // } else if (snapshot.key == "ActivityT") {
        //   for (key in Value) {
        //     ActivityT.push(Value[key]);
        //     TextT.push(key);
        //   }
        // }
        processData();
      });
}

//Write Data
function writeUserData(id, username, ai, rm, x, cdt, sdd) {
    userData[username]={
        displayName: username,
        userId: id,
        ifAI: ai,
        room: rm,
        pos : x,
        coreData: cdt,
        seedData: sdd
    }
    dbRef.child("userData").set(userData);
    console.log("set");
    // write_done = true;
  }
  

  
function clearDBReference(refName) {
    let ref = database.ref(refName);
// clear out the previous data in the key
    ref.remove()
    .then(function() {
        console.log("! DB Remove succeeded.");
    })
    .catch(function(error) {
        console.log("! DB Remove failed: " + error.message);
    });
}

// ---------------------- SIGNIN ---------------------- //
if(loginBtn){
    loginBtn.addEventListener('click', () => {
        firebase.auth().signInWithPopup(provider)
        .then((result) => {
        let user = result.user;
        let username = user.displayName;
        let userId = user.uid;

        readUserData(username);
        if(if_set && data_loaded){
            writeUserData(userId, username, false, null, null, null, null); 
        }
        
        if(write_done){
            window.location.href = "app/index.html";
        }
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
    
      console.log(errorMessage);
    });
    })
    
    visitBtn.addEventListener('click', () => {
        window.location.href = "app/index.html";
    })

}


