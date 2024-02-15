const socket = io('ws://localhost:3500')
const activity = document.querySelector('.activity')
const msgInput = document.querySelector('textarea')

function sendMessage(e) {
  e.preventDefault()
  if (msgInput.value) {
      socket.emit('message', msgInput.value)
      msgInput.value = ""
  }
  msgInput.focus()
}

// -------------------- CONNECTION ACTIVITY -------------------- //
socket.on("message", (msg) => {
  activity.textContent = `${msg.texts}`; 
  clearEventMsg();
})

// -------------------- TYPING ACTIVITY -------------------- //
msgInput.addEventListener('keypress', () => {
  socket.emit('activity', socket.id.substring(0, 5))
})

let activityTimer;
socket.on("activity", (name) => {
  activity.textContent = `${name} is typing...`; 
  clearEventMsg();
})

function clearEventMsg(){
  clearTimeout(activityTimer)
    activityTimer = setTimeout(() => {
        activity.textContent = ""
    }, 3000)
}



// -------------------- P5 SKETCH -------------------- //

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
createCanvas(windowWidth, windowHeight);
canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style("z-index", "-1");
}

// Main draw function
function draw() {
  background(0);
  for(let i = 0; i < cores.length; i ++){
    cores[i].display();
  }
  

}
  

// -------------------- CLASS -------------------- //

// Core Class
class Core {
  constructor(x, y, user) {
      this.x = x;
      this.y = y;
      this.user = user;
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
    noStroke();
    fill(255)
    circle(this.x, this.y, this.radius);
  }

  writeText() {
    // Show input box
    let writeArea = document.getElementsByClassName("writeAreaContainer")
    let submitButton = document.getElementsByClassName("button-submit")
    writeArea.style.visibility = "visible";

    submitButton.addEventListener(
      "click",
      function () {
        this.data[0] = textArea.value;
        this.ifCheckDataNum = true;
        this.isWriting = false;
        this.ifClicked = false;
        let divToRemove = document.getElementById("writeAreaContainer");
        writeArea.style.display = "none";
      }.bind(this)
    );  
  }
}





