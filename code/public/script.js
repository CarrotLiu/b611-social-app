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
let myDBKey, otherDBKeys = [];

let myName, myId, myLayer, myColor, myFreq, myCDT, mySDT, mySTD, mySize;
let myCore, myPrince, mySeeds = [], myStars, myStem;
let myX, myY = window.innerHeight / 2;
let currentLayer = 1;
let maxLayerNum = 2;

let ifRoomSet = false;
let located = false;
let otherFlowersLoaded = false;
let otherPrincesLoaded = false;

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

let colorPrince = [
  [
    [244, 206, 20], // scarf and hair
    [216, 180, 3], // scarf darker
    [91, 179, 24], //cloth
    [43, 122, 11], //cloth darker
    [56, 130, 60]//stem
  ],
  [
    [255, 234, 221],
    [230, 209, 200],
    [250, 80, 80],
    [200, 30, 30],
    [250, 80, 80]
  ],
  [
    [234, 253, 252],
    [205, 220, 225],
    [130, 170, 227],
    [86, 115, 180],
    [120, 150, 190]

  ]
]
let data_loaded = false;

socket.on('bye',(userId)=>{
  for(let i = 0; i < princes.length; i++){
    if(princes[i].id == userId){
      princes.splice(i, 1);
      i--;
    }
  }
})

socket.on('checkSelf', (rst)=>{
  myName = rst[0].displayName;
  myLayer = rst[0].layerNum;
  myId = rst[0].userId;
  myColor = rst[0].color;
  myFreq = rst[0].freq;
  myX = rst[0].myX;
  myCDT = rst[0].coreData;
  mySDT = rst[0].seedData;
  mySTD = rst[0].starData;
  mySize = rst[0].size;
  myDBKey = rst[1];
  cnvX = 0;
  console.log(myDBKey);
  if(myName){
    myPrince = new Prince(myX + 200, myY + 100, myFreq, myName, colorPrince[myColor], true, myId);
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
  }else{
    myPrince = new Prince(myX - 200, myY + 100, myFreq, myId, colorPrince[myColor], true, myId);
  }
});

socket.on('otherFlower', (others)=>{
  // console.log("loading other flowers!!!!!")
  otherDBKeys = others[1];
  console.log(otherDBKeys);
  if(others[0].length >0){
    for (let i = 0; i < others[0].length; i ++) {
      let user = others[0][i];
      if(user.displayName){
        cores.push(new Core(user.myX, window.innerHeight / 2, user.layerNum, user.color, user.freq, user.size, user.displayName, user.coreData, false));
        let userSeed = [];
        for (let r = currentLayer; r > 0; r--) {
          for (let i = 0; i < 2 * PI; i += (2 * PI) / (11 + r * 3)) {
            userSeed.push(new Seed(
              user.myX,                    
              window.innerHeight / 2,
              user.layerNum,
              i,
              random(0, 0.003),
              random(0.001, 0.002),
              user.color,
              user.freq
            ));
          }
        }
        seeds.push(userSeed);
      }
    }
  }
  otherFlowersLoaded = true;
})

socket.on('checkOthers', (otherData)=>{
  console.log("userData",otherData[0]);
  console.log("userX",otherData[1]);
  for(let i = 0; i < otherData[0].length; i++){
    let newOtherDT = otherData[0][i];
    let newOtherName = newOtherDT.displayName;
    let newOtherId = newOtherDT.userId;
    
    let newOtherX = otherData[1].filter(user => Object.keys(user)[0] == newOtherId)[0];
    console.log(newOtherX[newOtherId])
    console.log(princes);
    let ifExists = false;
    for (let j = 0; j < princes.length; j++) {
      if (princes[j].id == newOtherId) {
        ifExists = true;
        break; // Exit loop once prince is found
      }
    }
    if (!ifExists) {
      princes.push(new Prince(newOtherX[newOtherId], window.innerHeight / 2 + 100, newOtherDT.freq, newOtherName, colorPrince[newOtherDT.color], false, newOtherId));
    }

    // if(princes.length > 0){
    //   for(let j = 0; j < princes.length; j++){
    //     if(princes[j].name != newOtherName){
    //       console.log(newOtherX)
    //       princes.push(new Prince(newOtherX[newOtherName], window.innerHeight / 2 + 100, newOtherDT.freq, newOtherName, colorPrince[newOtherDT.color], false));
    //       console.log(princes);
    //     }
    //   }
    // }else{
    //   princes.push(new Prince(newOtherX[newOtherName], window.innerHeight / 2 + 100, newOtherDT.freq, newOtherName, colorPrince[newOtherDT.color], false));
    // }
  }
})

socket.on('newKey', ()=>{
  otherDBKeys.push(newKey);
  console.log(otherDBKeys);
})

socket.on('newOthers', (newOther)=>{
  let newOtherName = newOther.displayName;
  let newOtherId = newOther.userId;
  console.log(`${newOtherName} just arrived`);
  let ifExist = false;
  for(let i = 0; i < princes.length; i++){
    if(princes[i].id == newOtherId){
      ifExist = true;
      break;
    }
  }
  if(!ifExist){
    princes.push(new Prince(newOther.myX + 200, window.innerHeight / 2 + 100, newOther.freq, newOtherName, colorPrince[newOther.color], false, newOtherId));
    console.log(princes);
  }
})

// -------------------- HTML ACTIVITY -------------------- //
const activity = document.querySelector('.activity');
const msgInput = document.querySelector('textarea');
const locateBtn = document.querySelector("#btn-locate");
const starBtn = document.querySelector("#btn-star");
const helpBtn = document.querySelector("#btn-bulb");
const logBtn = document.querySelector("#btn-signout");

//connection activity
socket.on("message", (msg) => {
  // console.log(msg);
  activity.textContent = msg; 
  clearEventMsg();
})

//typing activity
msgInput.addEventListener('keypress', () => {
  socket.emit('activity', myName)
})

let activityTimer;
socket.on("activity", (msg) => {
  activity.textContent = msg; 
  clearEventMsg();
})

socket.on('bye', (msg)=>{
  socket.emit('activity', msg);
})
  
//time function for clearing messages
function clearEventMsg(){
  clearTimeout(activityTimer)
    activityTimer = setTimeout(() => {
        activity.textContent = ""
    }, 5000)
}

locateBtn.addEventListener('click', ()=>{locateSelf();});
// -------------------- P5JS SKETCH -------------------- //
let canvas;
let stars = [];
let stopHover = false;

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
  
  if(myPrince && !located){
    cnvX = -(myX - window.innerWidth / 2);
    myPrince.x = myX + cnvX + 200;
    located = true;
  }
  //translate 所有其他东西
  push()
  translate(cnvX, 0);
  //self dandelion
  drawMyDande();
  //others dandelion
  drawOtherDande();
  drawOtherPrince();
  pop()
  drawMyPrince();
}
function drawMyPrince(){
  if(myPrince){
    push();
    princeWalk();
    myPrince.update();
    myPrince.display();
    pop();
  }
}
function drawOtherPrince(){
  if(princes.length > 0){
    for(let i = 0; i < princes.length;i++){
      if(princes[i].id == myId){
        princes.splice(i, 1)
        i--;
      }
    }
    for(let i = 0; i < princes.length;i++){
      push();
      princes[i].update();
      princes[i].display();
      pop();
    }
  }
}
function drawMyDande(){
  push();
  if(myCore){
    drawStem(map(sin(frameCount * 0.01 + myFreq), -1, 1, -60, 60),map(cos(myFreq), -1, 1, -10, 0),myX,myY,myColor);
    for(let i = 0; i < mySeeds.length; i++){
      // console.log(myDBKey);
      mySeeds[i].update(cnvX, myDBKey, stopHover);
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
    myCore.update(cnvX, myDBKey, stopHover);
    myCore.display();
  }
  pop();
}

function drawOtherDande(){
  push();
  if(otherFlowersLoaded){
    // console.log(cores);
    for(let i = 0; i < cores.length; i ++){
      drawStem(map(sin(frameCount * 0.01 + cores[i].freq), -1, 1, -60, 60),map(cos(cores[i].freq), -1, 1, -10, 0),cores[i].x,cores[i].y,cores[i].colorIndex);
    }
    for(let s = 0; s < seeds.length; s++){
      let userSeeds = seeds[s];
      for(let i = 0; i < userSeeds.length; i++){
        userSeeds[i].update(cnvX, myDBKey, stopHover);
        userSeeds[i].display();
        if (!userSeeds[i].ifFly) {
          userSeeds[i].lastCoreX = userSeeds[i].coreX;
          userSeeds[i].lastCoreY = userSeeds[i].coreY;
          userSeeds[i].lastSeedX = userSeeds[i].seedX;
          userSeeds[i].lastSeedY = userSeeds[i].seedY;
        }      
        if (userSeeds[i].flyDone) {
          userSeeds.splice(i, 1);
        }
      }
    }
    for(let i = 0; i < cores.length; i ++){
      cores[i].update(cnvX, myDBKey, stopHover);
      cores[i].display();
    } 
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
    if(keyCode == 39){
      myPrince.walkDir = 1;
    }else if(keyCode == 37){
      myPrince.walkDir = -1;
    }
    //ArrowRight / ArrowLeft
    myPrince.ifIdle = false;
    myPrince.ifWalk = true; // => this.ifWalk
    cnvX += myPrince.cnvX;
    if (myPrince.walkCount <= 60) { 
      myPrince.walkCount++;
    }
    // console.log("xout:",myPrince.xOut);
      socket.emit('updatePos',[myId, myPrince.walkDir, myPrince.ifWalk, myPrince.xOut]);
    
  } else {
    myPrince.ifWalk = false;
    myPrince.ifIdle = true;
    myPrince.walkCount = 0;
    myPrince.clothX = 0;
  }
}

function keyReleased(){
  if(keyCode == 39 || keyCode == 37){
    myPrince.ifWalk = false;
    myPrince.ifIdle = true;
    myPrince.walkCount = 0;
    myPrince.clothX = 0;
    // console.log("x", myPrince.x);
    // console.log("xOut",myPrince.xOut);
    socket.emit('updatePos',[myId, myPrince.walkDir, false, myPrince.xOut]);
    
  }
}

socket.on('getMove', function (posDt){
  let otherName = posDt[0];
  // console.log(posDt);
  if(princes.length >0){
    for(let i = 0; i < princes.length; i++){
      let prince = princes[i];
      if(prince.id == otherName){
        prince.walkDir = posDt[1];
        prince.ifWalk = posDt[2];
        prince.ifIdle = !posDt[2];
        
        if(prince.ifWalk){ 
          if (prince.walkCount <= 60) { 
            prince.walkCount++;
          }
          console.log(prince.ifWalk);
          console.log(prince)
          
        }else{
          prince.walkCount = 0;
          prince.clothX = 0;
          prince.x = posDt[3];
        }
        
      }
    }
  }
}.bind(this))

socket.on('getPos', function (userX) {
  let otherName = Object.keys(userX)[0];
  if(princes.length >0){
    for(let i = 0; i < princes.length; i++){
      let prince = princes[i];
      // console.log(prince.x)
      if(prince.id == otherName){
        prince.x = userX[otherName];
        // console.log(prince.x);
      }
    }
  }
}.bind(this))

function locateSelf(){
  if(myPrince){
    cnvX = -(myX - window.innerWidth / 2);
    myPrince.x = myX + cnvX + 200;
    socket.emit('updatePos',[myId, myPrince.walkDir, false, myPrince.xOut]);
  } 
}

function locateOther(flowerX){
  if(myPrince){
    cnvX = -(flowerX - window.innerWidth / 2);
    myPrince.x = flowerX + cnvX - 200;
  } 
}

function mousePressed(){
  if(myCore){

  }
}



