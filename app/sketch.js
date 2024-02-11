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
    this.radius = 50;
}

update(){

}

display() {
  noStroke();
  fill(255)
  circle(this.x, this.y, this.radius);
}

handleClick() {
    // Show input box

}
}