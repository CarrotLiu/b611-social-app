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
const storage = firebase.storage();
const dbRef = db.ref("userData");

//init authentication
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

// ---------------------- READ & WRITE DATA ---------------------- //
let write_done = false;
let ifNewUser = false;
let myKey;
let dbKeys = [];
let userList=[]; 
let DBUserList=[];
//Read Data
async function readUserData(id) {
    return new Promise((resolve, reject) => {
        dbRef.once("value", (snapshot) => {
            let exists = false;
            let userFound = false; 
            let value;
            snapshot.forEach((childSnapshot) => {
                value = childSnapshot.val();
                DBUserList.push(value);
                userList.push(value);
                dbKeys.push(childSnapshot.key);
            });
            snapshot.forEach((childSnapshot) => {
                value = childSnapshot.val();
                for (let i = 0; i < userList.length; i++) {
                    if (userList[i].userId == id) {
                        exists = true;
                        myKey = childSnapshot.key;
                        userFound = true; 
                        console.log(myKey);
                        console.log(exists);
                        break; // Break out of the inner loop
                    }
                }
                if (userFound) {
                    // Break out of the outer loop if user is found
                    return true;
                }
            });
            if(!userFound){
                DBUserList.push(value);
                userList.push(value);
            }
            resolve(exists);
        }, (error) => {
            reject(error);
        });
    });
}

function writeNewUser(id, username, cdt, sdt, std, pos, l, c, f, s) {
    console.log("write new user");
    let newu = {username:{}}
    
    const newUserId = dbRef.push(newu).key;
    dbKeys.push(newUserId);
    myKey = newUserId;
    ifNewUser = true;

    userList.push({
        displayName: username,
        userId: id,
        coreData: cdt,
        seedData: sdt,
        starData: std,
        myX: pos,
        layerNum: l,
        color: c,
        freq: f,
        size: s,
        ifLock: false,
        dbKey: newUserId,
        images: [" "]
    });
    
    DBUserList.push({
        displayName: username,
        userId: id,
        coreData: cdt,
        seedData: sdt,
        starData: std,
        myX: pos,
        layerNum: l,
        color: c,
        freq: f,
        size: s,
        ifLock: false,
        dbKey: newUserId,
        images: [" "]
    });
    dbRef.child(newUserId).set({
        displayName: username,
        userId: id,
        //text data
        coreData: cdt,
        seedData: sdt,
        //position data
        starData: std, 
        myX: pos,
        //dande render
        layerNum: l,
        color: c,
        freq: f,
        size: s,
        ifLock: false,
        dbKey: newUserId,
        images: [" "]
    });
    write_done = true;
}

function writeCore(userid, cdt){
    socket.emit('newCoreData', [myKey, cdt]);
    dbRef.child(userid).child("coreData").set(cdt).then(function(){
        console.log("update core data");
    }).catch(function(error){
        console.log('Error updating core data:', error);
    })
}

function writeSeed(userid, sdt){
    socket.emit('newSeedData', [myKey, sdt]);
    dbRef.child(userid).child("seedData").set(sdt).then(function(){
        console.log("update seed data");
    }).catch(function(error){
        console.log('Error updating seed data:', error);
    })
    
}

function writeStar(userid, std){
    dbRef.child(userid).child("starData").set(std).then(function(){
        console.log("update star data");
    }).catch(function(error){
        console.log('Error updating star data:', error);
    })
}

function writeLock(userid, ifLock){
    dbRef.child(userid).child("ifLock").set(ifLock).then(function(){
        console.log("update lock data");
    }).catch(function(error){
        console.log('Error updating lock data:', error);
    })
}

async function writeImage(file, userId) {
    console.log(userId);
    let imageRef = dbRef.child(userId).child("images");
    let currentImages = [];

    imageRef.once('value', (snapshot) => {
        currentImages = snapshot.val() || [" "];
        console.log("Image array before writing image:", currentImages);
    }).then(() => {
        if (file) {
            let storageRef = storage.ref('images/' + userId + '/' + file.name);
            let uploadTask = storageRef.put(file);

            uploadTask.on('state_changed', (snapshot) => {
                // Handle upload progress if needed
            }, (error) => {
                console.error('Error uploading image:', error);
                reject(error); // Reject the promise on upload error
            }, () => {
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    console.log("Download URL:", downloadURL);
                    if (currentImages.length == 1 && currentImages[0] == " ") {
                        currentImages[0] = downloadURL;
                    } else {
                        currentImages.push(downloadURL);
                    }
                    dbRef.child(userId).child("images").set(currentImages).then(() => {
                        console.log('Image URL saved to database');
                        console.log("Image array after writing image:", currentImages);
                        return currentImages;
                    }).catch((error) => {
                        console.error('Error saving image URL to database:', error);
                        reject(error); // Reject the promise on database error
                    });
                }).catch((error) => {
                    console.error('Error getting download URL:', error);
                    reject(error); // Reject the promise on download URL error
                });
            });
        } else {
            currentImages.push(" ");
            dbRef.child(userId).child("images").set(currentImages).then(() => {
                console.log('Image URL saved to database');
                console.log("Image array after writing image:", currentImages);
                return currentImages;
            }).catch((error) => {
                console.error('Error saving image URL to database:', error);
                reject(error); // Reject the promise on database error
            });
        }
    }).catch((error) => {
        console.log('Error reading current image data:', error);
        reject(error); // Reject the promise on database read error
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
            console.log("avatar:", photoURL);
            let signoutBtn = document.querySelector("#btn-signout");
            signoutBtn.style.backgroundImage = `url('${photoURL}')`;
            signoutBtn.style.borderRadius ="50%";
            signoutBtn.style.boxShadow = "0px 0px 10px 0px rgba(255, 255, 255, 0.75)";
            signoutBtn.addEventListener('mouseenter', function() {
                signoutBtn.style.borderRadius = "0%";
                signoutBtn.style.boxShadow ="none";
                signoutBtn.style.backgroundImage = "url('assets/door-open.svg')"; 
            });
            signoutBtn.addEventListener('mouseleave', function() {
                signoutBtn.style.backgroundImage = `url('${photoURL}')`; 
                signoutBtn.style.borderRadius ="50%";
            signoutBtn.style.boxShadow = "0px 0px 10px 0px rgba(255, 255, 255, 0.75)";
            });
            const exists = await readUserData(userId);  //userList现在是database里所有的user！！！如果是新用户/visitor，就还没存进去！！！
            // console.log("now exists is:", exists)

            if (!exists) {
                console.log("new user!");
                let l = 1;
                let c= Math.floor(Math.random() * 3);
                let f = Math.random() * Math.PI + Math.PI;
                let s = Math.random() * (1.1 - 0.9) + 0.9;
                
                let index = userList.length + 1;
                
                let marginX = s * 80;
                let roomX = 1300 + s * 10;
                let min = roomX * (index - 1) + marginX;
                let max = roomX * index - marginX;
                console.log(max, min);
                let myX = Math.random() * (max - min) + min;
                // console.log(marginX, index, roomX, myX);
                writeNewUser(userId, username, [" "], [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "], [" "], myX, l, c, f,s); //如果是新用户，存进去了！
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
    // visitBtn.addEventListener('click', async () => {
    //     try {
    //         let id =  `${socket.id}`;
    //         let s = Math.random(0.8, 1.1);
    //         let index = userList.length;
    //         let marginX = s * 80;
    //         let roomX = s * 700;
    //         let xpos = width / 2;
    //         userList.push({
    //             displayName: null,
    //             userId: id,
    //             coreData: [],
    //             seedData: [],
    //             starData: [],
    //             myX: xpos,
    //             layerNum: 1,
    //             color: Math.floor(Math.random() * 3),
    //             freq: Math.random(Math.PI, 2 * Math.PI),
    //             size: s
        
    //         }); //visitor也存进userList了！
    //         //到此为止获得所有的database里的用户 + 当前登陆者（新用户/visitor）的object data。
    //         //所以userList里存了所有用户以及可能有一个visitor，但不包含其他在线的visitor。
    //         //我胡汉三再忘记userList是啥就就改名卜萝胡。
    //         let exist = await readUserData(null);
    //         startApp(id, "visitor");
    //     } catch (error) {
    //         console.log(error.message);
    //     }
    // })
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
    console.log(dbKeys, userList)
    socket.emit("login", [userList, userId, type, DBUserList, dbKeys, myKey, ifNewUser]);
    
}

// -------------------- GLOBALIZE FUNCTION -------------------- //
window.readUserData = readUserData;
window.writeNewUser = writeNewUser;
window.writeCore = writeCore;
window.writeSeed = writeSeed;
window.writeStar = writeStar;
window.signin = signin;
window.writeLock = writeLock;
window.writeImage = writeImage;