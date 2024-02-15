let cores = [];
let canvas;
  
function setup() {
createCanvas(windowWidth, windowHeight);
canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style("z-index", "-1");

//setup dandelion objects
cores.push(new Core(windowWidth / 2 - 200, windowHeight / 2));
}

// Main draw function
function draw() {
  background(0);
  cores[0].display();

}
  

// Core Class
class Core {
  constructor(x, y) {
      this.x = x;
      this.y = y;
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
    writeArea.style.display = "block";

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


