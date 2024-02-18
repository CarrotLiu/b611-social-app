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

let userNum = 0;
let userData = {};
let data_loaded = false;
let write_done = false;
const loginBtn = document.querySelector("#login")
const visitBtn = document.querySelector("#visit")
// const fireApp = initializeApp(firebaseConfig)
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const dbRef = db.ref("userData");
// const db = getDatabase(fireApp);
// const auth = getAuth(fireApp);
// const provider = new GoogleAuthProvider(fireApp);
// const dbRef = ref(db, 'userData');
console.log(dbRef);
//Read Data


//Write Data
function writeUserData(id, username, ai, rm, x, cdt, sdd) {
    console.log("write");
    userData[username]={
        displayName: username,
        userId: id,
        ifAI: ai,
        room: rm,
        pos : x,
        coreData: cdt,
        seedData: sdd
    }
    console.log(userData);
    // set(ref(db, 'userData/'), {userData});

    dbRef.child("userData").push(userData);
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
        writeUserData(userId, username, false, null, null, null, null); 
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


