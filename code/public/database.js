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
        dbRef.on("child_added", (snapshot) => {
            let Value = snapshot.val();
            userList = Object.values(Value);
            let exists = false;
            for (let i = 0; i < userList.length; i++) {
                if (userList[i].userId == id) {
                    exists = true;
                    break;
                }
            }
            resolve(exists);
        });
    });
}

function writeUserData(id, username, pic, ai, rm, x, cdt, sdd, std) {
    const newUserId = dbRef.child("userData").push().key;
    dbRef.child("userData").child(newUserId).set({
        displayName: username,
        userId: id,
        profilePic: pic,
        ifAI: ai,
        room: rm,
        pos: x,
        coreData: cdt,
        seedData: sdd,
        starData: std
    });
    write_done = true;
}

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
const signoutBtn = document.querySelector("#btn-signout");

if(loginBtn){
    loginBtn.addEventListener('click', async () => {
        try {
            const { username, userId, photoURL } = await signin();
            const userExists = await readUserData(userId);
            if (!userExists) {
                writeUserData(userId, username, photoURL, false, "", "", "", "", "");
            }else{
                window.location.href = "app/index.html";
            }
            if (write_done) {
                window.location.href = "app/index.html";
            }
        } catch (error) {
            console.log(error.message);
        }
    });
    visitBtn.addEventListener('click', () => {
        window.location.href = "app/index.html";
    })
} else{
    signoutBtn.addEventListener('click', async ()=>{
        try {
            const result=await signout();
            window.location.href = "../index.html";
        } catch(error){
            console.log(error.message);
        }
    })
}



// -------------------- EXPORT FUNCTION -------------------- //
window.readUserData = readUserData;
window.writeUserData = writeUserData;
window.signin = signin;
