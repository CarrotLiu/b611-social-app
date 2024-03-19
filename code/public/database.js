// ---------------------- INITIALIZATION ---------------------- //
//init firebase 
socket = io('ws://localhost:3500')

const firebaseConfig = {
    apiKey: "AIzaSyCxkgwdNTOPwhosEk6zNwzXPqasIqIuhCY",
    authDomain: "b611-185f3.firebaseapp.com",
    projectId: "b611-185f3",
    storageBucket: "b611-185f3.appspot.com",
    messagingSenderId: "557411252910",
    appId: "1:557411252910:web:d84c2b9c084573f00a8b3f",
    databaseURL: "https://b611-185f3-default-rtdb.firebaseio.com/"
};
firebase.initializeApp(firebaseConfig);

//init database
const db = firebase.database();
const dbRef = db.ref("userData");

//init authentication
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

// ---------------------- READ & WRITE DATA ---------------------- //
let write_done = false;
let userList=[];

//Read Data
async function readUserData(id) {
    return new Promise((resolve, reject) => {
        dbRef.once("value", (snapshot) => { 
            snapshot.forEach((childSnapshot) => {
                let value = childSnapshot.val();
                userList.push(value);
            });
            let exists = false;
            for (let i = 0; i < userList.length; i++) {
                if (userList[i].userId == id) {
                    exists = true;
                    break;
                }
            }
            resolve(exists);
        }, (error) => {
            reject(error); 
        });
    });
}


function writeNewUser(id, username, pic, ai, cdt, sdt, std, l, c, f) {
    console.log("write new user");
    let newu = {username:{}}
    const newUserId = dbRef.push(newu).key;
    userList.push({
        displayName: username,
        userId: id,
        profilePic: pic,
        ifAI: ai,
        coreData: cdt,
        seedData: sdt,
        starData: std,
        layerNum: l,
        color: c,
        freq: f

    });
    dbRef.child(newUserId).set({
        displayName: username,
        userId: id,
        profilePic: pic,
        ifAI: ai,
        coreData: cdt,
        seedData: sdt,
        starData: std,
        layerNum: l,
        color: c,
        freq: f
    });
    write_done = true;
}

function writeCore(userid, cdt){
    console.log("update core data");
    dbRef.child(userid).child("coreData").update(cdt);
}

function writeSeed(userid, sdt){
    console.log("update seed data");
    dbRef.child(userid).child("seedData").update(sdt);
}

function writeStar(userid, std){
    console.log("update seed data");
    dbRef.child(userid).child("seedData").update(std);
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



// ---------------------- SIGN IN/OUT ---------------------- //
const loginBtn = document.querySelector("#login");
const visitBtn = document.querySelector("#visit");
const loginContainer = document.querySelector("#login-btns");
const topContainer = document.querySelector("#topBtnContainer");
const signoutBtn = document.querySelector("#btn-signout");

function signin() {
    return new Promise((resolve, reject) => {
        firebase.auth().signInWithPopup(provider)
            .then((result) => {
                let user = result.user;
                let username = user.displayName;
                let userId = user.uid;
                let photoURL = user.photoURL;
                resolve({ username, userId, photoURL });
            })
            .catch((error) => {
                reject(error);
            });
    });
} 

function signout(){
    return new Promise((resolve, reject)=>{
        firebase.auth().signOut(provider)
        .then((result) => {
            resolve(result); 
          }).catch((error) => {
            reject(error);
          });
    })
}

if(loginContainer.style.display != "none"){
    loginBtn.addEventListener('click', async () => {
        try {
            const { username, userId, photoURL } = await signin();
            const exists = await readUserData(userId);
            if (!exists) {
                console.log("new user!");
                let l = 1;
                let c= Math.floor(Math.random() * 3);
                let f = Math.random(Math.PI, 2 * Math.PI);
                writeNewUser(userId, username, photoURL, false, [" "], [" "], [" "], l, c, f);
            }else{  
                write_done = true;
            }
            if (write_done) {
                startApp(userId, "user");
            }
     
        } catch (error) {
            console.log(error.message);
        }
    });
    visitBtn.addEventListener('click', () => {
        let id =  `${socket.id}`;
        userList.push({
            displayName: null,
            userId: id,
            profilePic: "assets/door-close.svg",
            ifAI: false,
            coreData: [],
            seedData: [],
            starData: [],
            layerNum: 1,
            color: Math.floor(Math.random() * 3),
            freq: Math.random(Math.PI, 2 * Math.PI)
    
        });
        startApp(id, "visitor");
    })
} else{
    signoutBtn.addEventListener('click', async ()=>{
        try {
            const result = await signout();
        } catch(error){
            console.log(error.message);
        }
    })
}

function startApp(userId, type){
    loginContainer.style.display = "none";
    topContainer.style.display = "flex";
    document.querySelector("#p5-container").style.visibility = "visible";
    document.querySelector("body").style.background = "none";
    socket.emit("login", [userList, userId, type]);
    
}


// -------------------- GLOBALIZE FUNCTION -------------------- //
window.readUserData = readUserData;
window.writeNewUser = writeNewUser;
window.signin = signin;
