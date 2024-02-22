// let socketURL;
// if (window.location.hostname.includes('localhost')) {
//   socketURL = 'ws://localhost:3500'; 
// } else {
//   socketURL = 'wss://carrotliu.github.io'; 
// }
// const socket = io(socketURL);
socket = io('ws://localhost:3500')

// ---------------------- INITIALIZE RM & POS ---------------------- //
let users, username, userid, profilePic, ifAI, room, pos, coreData, seedData, starData;
let data_loaded = false;
readUserData()
    .then(exists => {
        users = userList;
        username = users.displayName;
        userid = users.userId;
        ifAI = users.ifAI;
        room = users.room;
        pos = users.pos;
        coreData = users.coreData;
        seedData = users.seedData;
        socket.emit('initialize', "getting room and pos");
        data_loaded = true;
        // socket.on('getrmpos', (room, pos)=>{
        //   writeOldUser(userid, room, pos)
        //   .then(exists => {
        //     data_loaded = true;
        //   })
        // })   
    })
    .catch(error => {
        console.error(error);
    });

if(data_loaded){
  console.log("data_loaded!");
  
}


const activity = document.querySelector('.activity')
const msgInput = document.querySelector('textarea')

if(data_loaded){
  // -------------------- HTML ACTIVITY -------------------- //
  //connection activity
  socket.on("message", (msg) => {
    activity.textContent = `${msg.texts}`; 
    clearEventMsg();
  })

  //typing activity
  msgInput.addEventListener('keypress', () => {
    socket.emit('activity', socket.id.substring(0, 5))
  })

  let activityTimer;
  socket.on("activity", (name) => {
    activity.textContent = `${name} is typing...`; 
    clearEventMsg();
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
  let cores = [];
  let xPos = [innerWidth / 2 - 200, innerWidth / 2 + 200];
  let yPos = innerHeight / 2;
  let takenPos = {user: null, pos: null};

  socket.on("message", (msg)=>{
    if(takenPos.pos == null){
      cores.push(new Core(xPos[0], yPos, msg.user));
      takenPos.pos = 0;
    } else if (takenPos.pos == 0){
      cores.push(new Core(xPos[1], yPos, msg.user));
      takenPos.pos = 1;
    }
  })

  function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.style("z-index", "-1");
    background(0);
  }

  // Main draw function
  function draw() {
    background(0);
    if(data_loaded){
      // console.log(username);  
    }
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
      this.data = [];
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





// function sendMessage(e) {
//   e.preventDefault()
//   if (msgInput.value) {
//       socket.emit('message', msgInput.value)
//       msgInput.value = ""
//   }
//   msgInput.focus()
// }