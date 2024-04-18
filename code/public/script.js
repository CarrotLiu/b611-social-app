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

let myName, myId, myLayer, myColor, myFreq, myCDT, mySDT, mySTD, mySize, myLock, myImg;
let myCore, myPrince, mySeeds = [], myStars, myStem;
let myX, myY = window.innerHeight / 2;
let currentLayer = 1;
let maxLayerNum = 2;

let otherWalk = [];

let ifRoomSet = false;
let located = false;
let otherFlowersLoaded = false;
let otherPrincesLoaded = false;

let princes = [], cores = [], seeds = [], stems=[];
let otherX = [], otherLayer = [], otherColor = [], otherFreq = [], otherCDT=[], otherSDT = [], otherSTD = [], otherSize = [], otherLock = [], otherId = [], otherName=[], otherImgs = [];

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

let playlist = [];
let voices;
function preload() {
  playlist[0] = loadSound("assets/LagFyrirOmmu.weba");
  voices = loadSound("assets/humanvoices.mp3");
}

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
  myLock = rst[0].ifLock;
  myDBKey = rst[0].dbKey;
  myImg = rst[0].images;

  cnvX = 0;
  console.log("myDBKey:",myDBKey);
  if(myName){
    myPrince = new Prince(myX + 200, myY + 100, myFreq, myName, colorPrince[myColor], true, myId);
    myCore = new Core(myX, myY, myLayer, myColor, myFreq, mySize, myName, myCDT, true, myLock, myId, myDBKey, myImg);
    myCore.checkDataNum();
    let index = 0;
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
            myFreq,
            myId,
            myDBKey,
            mySDT[index],
            index,
            true
          )
        );
        index++;
      }
    }
    // console.log(mySeeds);
  }else{
    myPrince = new Prince(myX - 200, myY + 100, myFreq, myId, colorPrince[myColor], true, myId);
  }
});

socket.on('otherFlower', (others)=>{
  // console.log("loading other flowers!!!!!")
  if(others[0].length >0){
    // console.log(others);
    for (let i = 0; i < others[0].length; i ++) {
      let user = others[0][i];
      if(user.displayName){
        otherX.push(user.myX);
        otherLayer.push(user.layerNum);
        otherColor.push(user.color);
        otherFreq.push(user.freq);
        otherSize.push(user.size);
        otherName.push(user.displayName);
        otherCDT.push(user.coreData);
        otherSDT.push(user.seedData);
        otherSTD.push(user.starData);
        otherLock.push(user.ifLock);
        otherId.push(user.userId);
        otherDBKeys.push(user.dbKey);
        otherImgs.push(user.images);
        cores.push(new Core(user.myX, window.innerHeight / 2, user.layerNum, user.color, user.freq, user.size, user.displayName, user.coreData, false, user.ifLock, user.userId, user.dbKey, user.images));
        cores[i].checkDataNum();
        let userSeed = [];
        let index = 0;
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
              user.freq,
              user.userId,
              user.dbKey,
              user.seedData[index],
              index,
              false
            ));
            index++;
          }
        }
        seeds.push(userSeed);
      }
    }
  }
  otherFlowersLoaded = true;
})

socket.on('checkOthers', (otherData)=>{
  console.log("others' userData:",otherData[0]);
  console.log("others' userX:",otherData[1]);
  for(let i = 0; i < otherData[0].length; i++){
    let newOtherDT = otherData[0][i];
    let newOtherName = newOtherDT.displayName;
    let newOtherId = newOtherDT.userId;
    let newOtherX = otherData[1].filter(user => Object.keys(user)[0] == newOtherId)[0];
    console.log("all others' id:",newOtherX[newOtherId]);
    let ifExists = false;
    for (let j = 0; j < princes.length; j++) {
      if (princes[j].id == newOtherId) {
        ifExists = true;
        break; // Exit loop once prince is found
      }
    }
    if (!ifExists) {
      princes.push(new Prince(newOtherX[newOtherId], window.innerHeight / 2 + 100, newOtherDT.freq, newOtherName, colorPrince[newOtherDT.color], false, newOtherId));
      otherWalk.push(false);
    }
    console.log("other princes loaded:", princes);
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
    otherWalk.push(false);
    console.log(princes);
  }
})

// -------------------- HTML ACTIVITY -------------------- //
const activity = document.querySelector('.activity');
const msgInput = document.querySelector('textarea');
const locateBtn = document.querySelector("#btn-locate");
const blowBtn = document.querySelector("#btn-blow");
const helpBtn = document.querySelector("#btn-bulb");
const logBtn = document.querySelector("#btn-signout");
let soundBtn;
let mute = false;
if(document.querySelector("#btn-mute")){
  soundBtn = document.querySelector("#btn-mute");
  mute = false;
}else if(document.querySelector("#btn-unmute")){
  soundBtn = document.querySelector("#btn-unmute");
  mute = true;
}
soundBtn.addEventListener('click', ()=>{
  if(mute){
    soundBtn.setAttribute("id", "btn-mute");
    mute = false;
  }else{
    soundBtn.setAttribute("id", "btn-unmute");
    mute = true;
  }
})

locateBtn.addEventListener('click', ()=>{locateSelf();});
blowBtn.addEventListener('click', ()=>{
  if(mySeeds.length > 0){
    for(let i = 0; i < mySeeds.length; i++){
      mySeeds[i].ifFly=true;
    }
  }
  socket.emit('updateFly', myId);
});
logBtn.addEventListener('click', ()=>{
  location.reload();
});

//connection activity
socket.on("message", (msg) => {
  // console.log(msg);
  activity.textContent = msg; 
  clearEventMsg();
})

//typing activity
msgInput.addEventListener('keypress', () => {
  if(keyCode !=13 && keyCode != 37 && keyCode != 39 && keyCode != 38 && keyCode !=40){
    socket.emit('activity', "A Little Prince is writing...")
  }
})

let activityTimer;
socket.on("activity", (msg) => {
  activity.textContent = msg; 
  clearEventMsg();
})

socket.on('bye',(userId)=>{
  socket.emit('activity', "A Little Prince just left.");
  for(let i = 0; i < princes.length; i++){
    if(princes[i].id == userId){
      otherWalk.splice(i, 1);
      princes.splice(i, 1);
      i--;
    }
  }
})

  
//time function for clearing messages
function clearEventMsg(){
  clearTimeout(activityTimer)
    activityTimer = setTimeout(() => {
        activity.textContent = ""
    }, 5000)
}


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
  if(!mute){
    playlist[0].play();
  }
  
}

// Main draw function
function draw() {
  if (!mute) {
    if(!playlist[0].isPlaying()){
      playlist[0].loop();
    }
    
  }else{
    playlist[0].stop();
  }
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
  drawMyPrince();
  push()
  translate(cnvX, 0);
  drawOtherPrince();
  //self dandelion
  drawMyDande();
  //others dandelion
  drawOtherDande();
  
  pop()
  checkStopHover();
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

      //用魔法打败魔法！backup未解之bug！yeah！
      if(otherWalk[i]){
        if (princes[i].walkCount <= 60) { 
          princes[i].walkCount++;
        }
        princes[i].walk();
        princes[i].clothX = 20;
      }else{
        princes[i].walkCount = 0;
        princes[i].clothX = 0;
      }
      princes[i].display();

      pop();
    }
  }
}
function drawMyDande(){
  push();
  if(myCore){

    regrowMe();
    drawStem(map(sin(frameCount * 0.01 + myFreq), -1, 1, -60, 60),map(cos(myFreq), -1, 1, -10, 0),myX,myY,myColor);
    for(let i = 0; i < mySeeds.length; i++){
      // if(!mySeeds[i].ifClicked){}
      // console.log(myDBKey);
      mySeeds[i].update(cnvX, stopHover, mySDT);
      mySeeds[i].display(cnvX);
      if (!mySeeds[i].ifFly) {
        mySeeds[i].lastCoreX = mySeeds[i].coreX;
        mySeeds[i].lastCoreY = mySeeds[i].coreY;
        mySeeds[i].lastSeedX = mySeeds[i].seedX;
        mySeeds[i].lastSeedY = mySeeds[i].seedY;
      }else{
        if(!voices.isPlaying()){
          voices.play();
        }
      }
      if (mySeeds[i].flyDone) {
        mySeeds.splice(i, 1);
      }
    }
    myCore.update(cnvX, myDBKey, stopHover);
    myCore.display(cnvX);
  }
  pop();
}

function drawOtherDande(){
  push();
  if(otherFlowersLoaded){
    // console.log(cores);
    regrowOther();
    for(let i = 0; i < cores.length; i ++){
      drawStem(map(sin(frameCount * 0.01 + cores[i].freq), -1, 1, -60, 60),map(cos(cores[i].freq), -1, 1, -10, 0),cores[i].x,cores[i].y,cores[i].colorIndex);
    }
    for(let s = 0; s < seeds.length; s++){
      let userSeeds = seeds[s];
      for(let i = 0; i < userSeeds.length; i++){
        userSeeds[i].update(cnvX, stopHover, otherSDT[s]);
        userSeeds[i].display(cnvX);
        if (!userSeeds[i].ifFly) {
          userSeeds[i].lastCoreX = userSeeds[i].coreX;
          userSeeds[i].lastCoreY = userSeeds[i].coreY;
          userSeeds[i].lastSeedX = userSeeds[i].seedX;
          userSeeds[i].lastSeedY = userSeeds[i].seedY;
        }else{
          
          if(!voices.isPlaying()){
            voices.play();
          }
        }      
        if (userSeeds[i].flyDone) {
          userSeeds.splice(i, 1);
        }
      }
    }
    
    for(let i = 0; i < cores.length; i ++){
      cores[i].update(cnvX, myDBKey, stopHover);
      cores[i].display(cnvX);
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

function regrowMe() {
  if (mySeeds.length == 0) {
    currentLayer = 1;
    mySDT = [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "];
    writeSeed(myDBKey, mySDT)
    let index = 0;
    for (let i = 0; i < 2 * PI; i += (2 * PI) / (11 + currentLayer * 3)) {
      mySeeds.push(
        new Seed(
          myX,                    
          myY,
          myLayer,
          i,
          random(0, 0.003),
          random(0.001, 0.002),
          myColor,
          myFreq,
          myId,
          myDBKey,
          mySDT[index],
          index,
          true
        )
      );
      index++;
    }
    console.log(mySeeds);
  }
}

function regrowOther(){
  for(let s = 0; s < seeds.length; s++){
    let userSeed = seeds[s];
    if(userSeed.length == 0){
      let index = 0;
      otherSDT[s] = [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "]; 
      writeSeed(otherDBKeys[s], otherSDT[s]);
      for (let r = currentLayer; r > 0; r--) {
        for (let i = 0; i < 2 * PI; i += (2 * PI) / (11 + r * 3)) {
          userSeed.push(new Seed(
            otherX[s],                    
            window.innerHeight / 2,
            otherLayer[s],
            i,
            random(0, 0.003),
            random(0.001, 0.002),
            otherColor[s],
            otherFreq[s],
            otherId[s],
            otherDBKeys[s],
            otherSDT[s][index],
            index,
            false
          ));
          index++;
        }
      }
      seeds[s]=userSeed;
    }
  }
}

// -------------------- REALTIME UPDATE -------------------- //
function princeWalk(){
  if (keyIsPressed && (keyCode == 39 || keyCode == 37)) {
    if(keyCode == 39){
      myPrince.walkDir = 1;
    }else if(keyCode == 37){
      myPrince.walkDir = -1;
    }
    //ArrowRight / ArrowLeft
    myPrince.ifIdle = false;
    myPrince.ifWalk = true; 
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
  let otherId = posDt[0];
  // console.log(posDt);
  if(princes.length >0){
    for(let i = 0; i < princes.length; i++){
      // let prince = princes[i];
      if(princes[i].id == otherId){
        princes[i].walkDir = posDt[1];
        princes[i].ifIdle = !posDt[2];
        otherWalk[i] = posDt[2];
        // princes[i].ifWalk = posDt[2];
        console.log("ifWalk sent via socket:",posDt[2], "prince[i].ifWalk:",princes[i].ifWalk);
        if(posDt[2]){ 
          // princes[i].startWalk(princes[i].ifWalk);
          // if (princes[i].walkCount <= 60) { 
          //   princes[i].walkCount++;
          // }
          // this.clothX = 20;
          // princes[i].walk();
          // console.log("xout:",posDt[3]);
          // console.log(princes[i]) ;
          // console.log("prince[i].ifWalk:",princes[i].ifWalk);
        }else{
          // princes[i].walkCount = 0;
          // princes[i].clothX = 0;
          princes[i].x = posDt[3]; // xOut
        }
        break;
      }
    }
  }
})

socket.on('getPos', function (userX) {
  let otherId = Object.keys(userX)[0];
  if(princes.length >0){
    for(let i = 0; i < princes.length; i++){
      let prince = princes[i];
      // console.log(prince.x)
      if(prince.id == otherId){
        otherWalk[i] = false;
        prince.x = userX[otherId];
        // console.log(prince.x);
      }
    }
  }
})

socket.on('getLock', function (lockDt){
  let otherId = lockDt[0];
  if(cores.length >0){
    for(let i = 0; i < cores.length; i++){
      let core = cores[i];
      if(core.id == otherId){
        cores[i].ifLock = lockDt[1];
      }
    }
  }
})

socket.on('getCoreData', function (coreDt){
  console.log(coreDt);
  let otherId = coreDt[0];
  if(cores.length >0){
    for(let i = 0; i < cores.length; i++){
      let core = cores[i];
      if(core.id == otherId){
        core.coreData = coreDt[1];
      }
    }
  }
});

socket.on('getSeedData', function (seedDt){
  let otherId = seedDt[0];
  console.log(otherId);
  console.log(myDBKey);
  if(myDBKey == otherId){
    mySDT = seedDt[1];
    for(let i = 0; i < mySeeds.length; i++){
      mySeeds[i].data=mySDT[i];
    }
    console.log(mySDT)
  }
  if(seeds.length > 0){
    for(let s = 0; s < seeds.length; s++){
      let userSeeds = seeds[s];
      if(userSeeds[0].dbKey == otherId){
        otherSDT[s] = seedDt[1];
        let seedDT = otherSDT[s];
        for(let i = 0; i < userSeeds.length; i++){
          let seed = userSeeds[i];
          userSeeds[i].data=seedDT[i];
        }
      }
    }
  }
});

socket.on('getFly', function (myId){
  for(let s = 0; s < seeds.length; s++){
    let userSeeds = seeds[s];
    for(let i = 0; i < userSeeds.length; i++){
      let currentSd = userSeeds[i];
      if (currentSd.id == myId) {
        currentSd.ifFly = true;
      }      
    }
  }
})

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

function checkStopHover(){
  let readCore = window.getComputedStyle(document.querySelector("#readArea")).display;
  let writeCore = window.getComputedStyle(document.querySelector("#writeArea")).display;
  let readSeed = window.getComputedStyle(document.querySelector("#readCommentArea")).display;
  let writeSeed = window.getComputedStyle(document.querySelector("#commentArea")).display;
  
  if(writeSeed == "block" || readSeed == "block" || writeCore == "block" || readCore == "block"){
    stopHover = true;
    push()
    noStroke();
    fill(255);
    circle(width / 2, height / 2, 660);
    pop();
  } else {
    stopHover = false;
  }
  // console.log("stopHover:", stopHover);
}


function getTimestamp() {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1; 
  const year = now.getFullYear();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const timestampString = `\n${year}.${month}.${day}  ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}\n`;
  return timestampString;
}

function removeAllEventListeners(element) {
  const clonedElement = element.cloneNode(true);
  element.parentNode.replaceChild(clonedElement, element);
  return clonedElement;
}

function handleScroll(textDiv) {
  var scrollPosition = window.scrollY;
  textDiv.style.top = (50 + scrollPosition) + 'px';
}


// -------------------- GLOBALIZE FUNCTION -------------------- //
window.getTimestamp = getTimestamp;
window.removeAllEventListeners = removeAllEventListeners
window.handleScroll = handleScroll;