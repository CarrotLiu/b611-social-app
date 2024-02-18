import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getDatabase, ref, set, push, onValue, onChildAdded, onChildChanged, onChildRemoved} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-lite.js';
import { getAuth, getRedirectResult, signOut, signInWithPopup, signInWithRedirect, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

let userNum = 0;
let userData = [];
let data_loaded = false;

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


const fireApp = initializeApp(firebaseConfig)
const db = getDatabase(fireApp);
const auth = getAuth(fireApp);
const provider = new GoogleAuthProvider(fireApp);
const dbRef = ref(db, 'userData');

//Read Data
onValue(dbRef, (data)=>{
    console.log("!USER ADDED");
    let username = data.key;
    let dtArray = data.val();
    userData.push(dtArray);
    updateStarCount(postElement, data);
}) 

//Write Data
function writeUserData(userId, username, ifAI, room, pos, coreData, seedData) {
    set(ref(db, 'users/' + userId), {
        username: username,
        ifAI: ifAI,
        room: room,
        pos : pos,
        coreData: coreData,
        seedData: seedData
    });
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

signInWithPopup(auth, provider)
.then((result) => {
  // This gives you a Google Access Token. You can use it to access the Google API.
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const token = credential.accessToken;
  // The signed-in user info.
  const user = result.user;
  // IdP data available using getAdditionalUserInfo(result)
  console.log(user);
}).catch((error) => {
  // Handle Errors here.
  const errorCode = error.code;
  const errorMessage = error.message;
  // The email of the user's account used.
  const email = error.customData.email;
  // The AuthCredential type that was used.
  const credential = GoogleAuthProvider.credentialFromError(error);
  console.log(errorMessage);
});
