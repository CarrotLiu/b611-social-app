// ---------------------- INITIALIZATION ---------------------- //
//init firebase 
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
let userNum = 0;
let userList = [];
let userData={};
let write_done = false;

//Read Data
async function readUserData(id) {
    return new Promise((resolve, reject) => {
        dbRef.on("child_added", (snapshot) => {
            let Value = snapshot.val();
            userList = Object.values(Value);
            let exists = false;
            for (let i = 0; i < userList.length; i++) {
                if (userList[i].userId === id) {
                    exists = true;
                    break;
                }
            }
            resolve(exists);
        });
    });
}

function writeUserData(id, username, ai, rm, x, cdt, sdd) {
    const newUserId = dbRef.child("userData").push().key;
    dbRef.child("userData").child(newUserId).set({
        displayName: username,
        userId: id,
        ifAI: ai,
        room: rm,
        pos: x,
        coreData: cdt,
        seedData: sdd
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
                resolve({ username, userId });
            })
            .catch((error) => {
                reject(error);
            });
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
const loginBtn = document.querySelector("#login");
const visitBtn = document.querySelector("#visit");
if(loginBtn){
    loginBtn.addEventListener('click', async () => {
        try {
            const { username, userId } = await signin();
            const userExists = await readUserData(userId);
            if (!userExists) {
                writeUserData(userId, username, false, null, null, null, null);
                console.log("write_done")
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
}

window.readUserData = readUserData;
window.writeUserData = writeUserData;

