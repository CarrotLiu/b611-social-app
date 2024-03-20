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

let myName, myLayer, myColor, myFreq, myCDT, mySDT, mySTD, mySize;
let myCore, myPrince, mySeeds = [], myStars, myStem;
let myX, myY = window.innerHeight / 2;
let currentLayer = 1;
let maxLayerNum = 2;

let ifRoomSet = false;

let princes = [], cores = [], seeds = [], stems=[];
let otherX={}, otherY={};
let otherName = [], otherData = [];

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
let data_loaded = false;

socket.on('checkSelf', (rst)=>{
  myName = rst.displayName;
  myLayer = rst.layerNum;
  myColor = rst.color;
  myFreq = rst.freq;
  myX = rst.myX;
  myCDT = rst.coreData;
  mySDT = rst.seedData;
  mySTD = rst.starData;
  mySize = rst.size;
  cnvX = -(myX - window.innerWidth / 2);
  myPrince = new Prince(myX + 250, myY + 100, myFreq, myName);
  myCore = new Core(myX, myY, myLayer, myColor, myFreq, mySize, myName, myCDT, true);
  for (let r = currentLayer; r > 0; r--) {
    for (let i = 0; i < 2 * PI; i += (2 * PI) / (11 + r * 3)) {
      mySeeds.push(
        new Seed(
          myX,                    
          myY,
          myLayer,
          i,
          random(0, 0.003),
          random(0.001, 0.002),
          myColor,
          myFreq
        )
      );
    }
  }
  
});



socket.on('checkOthers',(others)=>{
  otherData = others[0];
  otherName = Object.key(others[1]);
  otherX = others[1];
  otherY = others[2];
  for (user in otherData) {
    cores.push(new Core(user.myX,  window.innerHeight / 2, user.layerNum, user.color, user.freq, user.size, user.displayName, user.coreData, false));
    for(key in otherName){
      if(user.displayName == key){
        princes.push(new Prince(otherX[key], otherY[key], user.freq, user.displayName));
      }
    }
  }
})

socket.emit('updatePos',[myName, myPrince.x, myPrince.y]);
socket.on('getPos', (pos)=>{
  otherName = Object.key(pos[0]);
  otherX = pos[0];
  otherY = pos[1];
  for(prince in princes){
    for(key in otherName){
      if(prince.name == key){
        prince.x = otherX[key];
        prince.y = otherY[key];
      }
    }
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
let stars = [];
let stopHover = false;
let ifClicked = false;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-container")
  canvas.position(0, 0);
  canvas.style("z-index", "-1");
  for (let i = 0; i < 150; i++) {
    stars.push(new Star(random(0, width), random(0, height)));
  }
}

// Main draw function
function draw() {
  background("#001C30");
  for (let i = 0; i < stars.length; i++) {
    stars[i].update();
    stars[i].display();
  }
  push()
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
  pop()
  
  if(myCore){
    push();
    princeWalk()
    if(myPrince){
      myPrince.update();
      myPrince.display();
    }
    pop();
  }
}

function drawSelf(){
  push();
  if(myCore){
    drawStem(map(sin(frameCount * 0.01 + myFreq), -1, 1, -60, 60),map(cos(myFreq), -1, 1, -10, 0),myX,myY,myColor);
    for(let i = 0; i < mySeeds.length; i++){
      mySeeds[i].update(stopHover, ifClicked);
      mySeeds[i].display();
      if (!mySeeds[i].ifFly) {
        mySeeds[i].lastCoreX = mySeeds[i].coreX;
        mySeeds[i].lastCoreY = mySeeds[i].coreY;
        mySeeds[i].lastSeedX = mySeeds[i].seedX;
        mySeeds[i].lastSeedY = mySeeds[i].seedY;
      }      
      if (mySeeds[i].flyDone) {
        mySeeds.splice(i, 1);
      }
    }
    myCore.update();
    myCore.display();
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

function princeWalk(){
  if (keyIsPressed && (keyCode == 39 || keyCode == 37)) {
    //ArrowRight / ArrowLeft
    console.log(myX)
    myPrince.ifIdle = false;
    myPrince.ifWalk = true; // => this.ifWalk
    cnvX += myPrince.cnvX;
    
    if (myPrince.walkCount <= 60) {
      myPrince.walkCount++;
    }
  } else {
    myPrince.ifWalk = false;
    myPrince.ifIdle = true;
    myPrince.walkCount = 0;
    myPrince.clothX = 0;
    // if (sceneIndex == 2 || sceneIndex == 3 || sceneIndex == 4) {
    //   prince2.ifWalk = false;
    //   prince2.ifIdle = true;
    //   prince2.walkCount = 0;
    //   prince2.clothX = 0;
    // }
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


