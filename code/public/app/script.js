// let socketURL;
// if (window.location.hostname.includes('localhost')) {
//   socketURL = 'ws://localhost:3500'; 
// } else {
//   socketURL = 'wss://carrotliu.github.io'; 
// }
// const socket = io(socketURL);
socket = io('ws://localhost:3500')
// ---------------------- INITIALIZE RM & POS ---------------------- //
let username, profilePic, ifAI;
let princes = [];
let cores = [];
let seeds = [];
let visitorAvatar = "../assets/door-close.svg";
let data_loaded = false;

socket.on('checkUser', (rst)=>{//rst = {username: string, userid: string, profilePic: png, ifAI: bool, coreData: string, seedData: string, starData:string}
  username = rst.displayName;
  profilePic = rst.profilePic;
  ifAI = rst.ifAI;
  cores.push(new Core(random(80 , window.innerWidth - 80),  window.innerHeight / 2, username, ifAI, rst.coreData));
  console.log(cores);
});

socket.on('checkVisitor', ()=>{ 
  username = null;
  profilePic = visitorAvatar;
  ifAI = false;
  cores.push(new Core(random(80 , window.innerWidth - 80),  window.innerHeight / 2, username, ifAI, null));
  console.log(cores);
})

socket.on('checkOthers',(others)=>{
  for (user in others) {
    cores.push(new Core(random(80 , window.innerWidth - 80),  window.innerHeight / 2, null, uesr.ifAI, user.coreData))
    console.log(cores);
  }
})

socket.on('bye', (username)=>{
  if(username.substring(0, 5) == "visitor"){
      console.log("is visitor! delete prince and dande");
  }else{
      console.log("is user! delete prince");
  }
})
// readUserData()
      // .then(() => {
      //     users = userList;
      //     username = users.displayName;
      //     userid = users.userId;
      //     ifAI = users.ifAI;
      //     coreData = users.coreData;
      //     seedData = users.seedData;
      //     starData = users.starData;
      //     data_loaded = true; 
      // })
      // .catch(error => {
      //     console.error(error);
      // });

const activity = document.querySelector('.activity')
const msgInput = document.querySelector('textarea')


// -------------------- HTML ACTIVITY -------------------- //
// function sendMessage(e) {
//   e.preventDefault()
//   if (msgInput.value) {
//       socket.emit('message', msgInput.value)
//       msgInput.value = ""
//   }
//   msgInput.focus()
// }
socket.on("message", (msg) => {
  console.log("emitted")
  activity.textContent = `${msg.texts}`; 
  clearEventMsg();
})
if(data_loaded){
  //connection activity
  socket.on("message", (msg) => {
    activity.textContent = `${msg.texts}`; 
    clearEventMsg();
  })

  //typing activity
  msgInput.addEventListener('keypress', () => {
    socket.emit('activity', username)
  })

  let activityTimer;
  socket.on("activity", (name) => {
    activity.textContent = `${username} is typing...`; 
    clearEventMsg();
  })

  socket.on('bye', (msg)=>{
    socket.emit('activity', username);
    
  })
  
}
//time function for clearing messages
function clearEventMsg(){
  clearTimeout(activityTimer)
    activityTimer = setTimeout(() => {
        activity.textContent = ""
    }, 3000)
}

// -------------------- P5JS SKETCH -------------------- //
let canvas;
let xPos = [innerWidth / 2 - 200, innerWidth / 2 + 200];
let yPos = innerHeight / 2;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style("z-index", "-1");
  background(0);
}

// Main draw function
function draw() {
  background(0);
  if(cores.length !=0){
    // console.log(username); 
    for(let i = 0; i < cores.length; i ++){
      cores[i].display();
    } 
  }
  
}

// -------------------- P5 CLASS -------------------- //
// Core Class
class Core {
  constructor(x, y, user, ai, cdt) {
      this.x = x;
      this.y = y;
      this.user = user;
      this.ifAI = ai;
      this.coreData = cdt;
      this.dmouse = dist(this.x, this.y, mouseX, mouseY);
      this.radius = 50;
      this.isWriting = false;
      this.ifClicked = false;
  }

  update(){
    this.dmouse = dist(this.x, this.y, mouseX, mouseY);
    
  }

  display() {
    if(this.dmouse < 20 && !this.ifClicked){
      fill(255,0,0);
    }else{
      fill(255);
    }
    noStroke();
    circle(this.x, this.y, this.radius);
  }

  writeText() {
    // Show input box
    let writeArea = document.querySelector('#writeArea')
    let submitButton = document.querySelector("#btn-finish")
    writeArea.style.visibility = "visible";

    submitButton.addEventListener(
      "click",
      function () {
        this.data[0] = textArea.value;
        this.ifCheckDataNum = true;
        this.isWriting = false;
        this.ifClicked = false;
        writeArea.style.visibility = "hidden";
      }.bind(this)
    );  
  }
}





