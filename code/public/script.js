// let socketURL;
// if (window.location.hostname.includes('localhost')) {
//   socketURL = 'ws://localhost:3500'; 
// } else {
//   socketURL = 'wss://carrotliu.github.io'; 
// }
// const socket = io(socketURL);
socket = io('ws://localhost:3500')
// ---------------------- INITIALIZE RM & POS ---------------------- //
let username, profilePic, ifAI, layerNum, color, freq;

let princes = [], cores = [], seeds = [];

let colorStem = [
  [56, 130, 60], // green
  [250, 80, 80], //pink
  [120, 150, 190], //blue
];

let colorRange = [
  [
    [91, 179, 24],
    [244, 206, 10],
  ],
  [
    [255, 234, 221],
    [255, 102, 102],
  ],
  [
    [130, 170, 227],
    [234, 253, 252],
  ],
];
let visitorAvatar = "assets/door-close.svg";
let data_loaded = false;

socket.on('checkSelf', (rst)=>{
  username = rst.displayName;
  profilePic = rst.profilePic;
  ifAI = rst.ifAI;
  layerNum = rst.layerNum;
  color = rst.color;
  freq = rst.freq;
  cores.push(new Core(random(80 , window.innerWidth - 80),  window.innerHeight / 2, layerNum, color, freq, username, ifAI, rst.coreData));
  console.log(cores);
});

socket.on('checkOthers',(others)=>{
  for (user in others) {
    cores.push(new Core(random(80 , window.innerWidth - 80),  window.innerHeight / 2, user.layerNum, user.color, user.freq, user.displayName, user.ifAI, user.coreData))
    console.log(others);
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
  //connection activity
  socket.on("message", (msg) => {
    console.log(msg);
    activity.textContent = msg; 
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
  
//time function for clearing messages
function clearEventMsg(){
  clearTimeout(activityTimer)
    activityTimer = setTimeout(() => {
        activity.textContent = ""
    }, 3000)
}

// -------------------- P5JS SKETCH -------------------- //
let canvas;

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


// display() {
//   if(this.dmouse < 20 && !this.ifClicked){
//     fill(255,0,0);
//   }else{
//     fill(255);
//   }
//   noStroke();
//   circle(this.x, this.y, this.radius);
// }


