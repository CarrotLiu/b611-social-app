// let socketURL;
// if (window.location.hostname.includes('localhost')) {
//   socketURL = 'ws://localhost:3500'; 
// } else {
//   socketURL = 'wss://carrotliu.github.io'; 
// }
// const socket = io(socketURL);
socket = io('ws://localhost:3500')
// ---------------------- INITIALIZE RM & POS ---------------------- //
let iX, roomX = 700, marginX = 80; 

let myName, myAvatar, myAI, myLayer, myColor, myFreq, myCDT, mySDT, mySTD;
let myCore, myPrince, mySeeds, myStars, myStem;
let myX, myY;

let ifRoomSet = false;

let princes = [], cores = [], seeds = [], stems=[];

let cnvX = 0;

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

socket.on("addRoom", (index)=>{
  myX = Math.random(marginX , roomX * index - marginX);
  myY = window.innerHeight / 2;
  cnvX = -(myX - window.innerWidth / 2);
  ifRoomSet = true;
});

socket.on('checkSelf', (rst)=>{
  myName = rst.displayName;
  myAvatar = rst.profilePic;
  myAI = rst.ifAI;
  myLayer = rst.layerNum;
  myColor = rst.color;
  myFreq = rst.freq;
  myCDT = rst.coreData;
  mySDT = rst.seedData;
  mySTD = rst.starData;
  
  myCore = new Core(myX, myY, myLayer, myColor, myFreq, myName, myAI, myCDT, true);
  myPrince = new Prince(myX + 250, myY + 100, myFreq);
});



socket.on('checkOthers',(others)=>{
  for (user in others) {
    cores.push(new Core(random(80 , window.innerWidth - 80),  window.innerHeight / 2, user.layerNum, user.color, user.freq, user.displayName, user.ifAI, user.coreData, false))
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
  translate(cnvX, 0);

  //self
  drawSelf();
  //others
  if(cores.length !=0){
    // console.log(username); 
    for(let i = 0; i < cores.length; i ++){
      cores[i].display();
    } 
  }
  
}

function drawSelf(){
  push();
  if(myCore){
    drawStem(map(sin(frameCount * 0.01 + myFreq), -1, 1, -60, 60),
    map(cos(myFreq), -1, 1, -10, 0),
    myX,myY,myColor);
    myCore.update();
    myCore.display();
    
  }
  if(myPrince){
    myPrince.update();
    myPrince.display();
  }
  pop();
}

function drawStem(x, y, transX, transY, colorIndex) {
  push();
  translate(transX, transY);
  strokeWeight(5);
  stroke(
    colorStem[colorIndex][0],
    colorStem[colorIndex][1],
    colorStem[colorIndex][2]
  );
  noFill();
  bezier(x, y, 0, 150, 0, 500, 0, 500);
  pop();
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


