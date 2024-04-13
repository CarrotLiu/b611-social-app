class Seed {
  constructor(x, y, layer, sdPos, dirx, diry, ci, freq, id, dbKey, data, index, ifSelf) {
    this.id = id;
    this.dbKey = dbKey;
    this.index = index;
    this.x = x;
    this.y = y;
    this.coreX = 0;
    this.coreY = 0;
    this.seedX = 0;
    this.seedY = 0;
    this.lastCoreX = 0;
    this.lastCoreY = 0;
    this.lastSeedX = 0;
    this.lastSeedY = 0;
    this.size = 0;

    this.layerNum = layer;
    this.seedPos = sdPos;
    this.freq = freq;

    this.xSpd = 0;
    this.ySpd = 0;
    this.dirx = dirx;
    this.diry = diry;
    this.angle = 0;
    this.flyAngle = 0;

    this.dmouse = dist(
      this.x + this.seedX,
      this.y + this.seedY,
      mouseX,
      mouseY
    );
    this.hideX = 0;
    this.hideY = 0; 
    this.ifSelf = ifSelf;

    this.isHovering = false;
    this.ifClicked = false;
    this.isWriting = false;
    this.isReading = false;
    
    this.data = data;

    this.removedReadDiv = null;

    this.ifFly = false;
    this.flyDone = false;
    this.colorIndex = ci;
  }

  update(cnvX, stopHover, sdt) {
    // console.log(this.data);
    //get mouse pos
    this.dmouse = dist(
      this.x + this.seedX + this.coreX,
      this.y + this.seedY + this.coreY,
      mouseX - cnvX,
      mouseY
    );
    //fly
    this.checkFly();
    if (this.ifFly) {
      this.fly();
      this.seedX += this.xSpd;
      this.seedY += this.ySpd;
    } else {
      if(!this.ifSelf){
        if(this.data != " "){
          this.checkHide();
        }else{
          this.checkHover(stopHover);
        }
      }else{
        this.checkHover(stopHover);
      }
      this.coreX = map(sin(frameCount * 0.01 + this.freq), -1, 1, -60, 60);
      this.coreY = map(cos(frameCount * 0.01 + this.freq), -1, 1, -10, 0);
      this.seedX =
        sin((PI / 2) * (this.layerNum + 1) + this.seedPos) *
          (40 + this.layerNum * 20) +
        this.hideX;
      this.seedY =
        cos((PI / 2) * (this.layerNum + 1) + this.seedPos) *
          (40 + this.layerNum * 20) +
        this.hideY;
    }
    this.checkClick(sdt);
  }

  display(cnv) {
    push();
    translate(this.x, this.y);
    this.drawSeedStem();
    this.drawSeed();
    pop();
    push(); 
    translate(-cnv, 0);
    if(this.isReading || this.isWriting){
      this.textBG();
    }
    pop();
  }

  drawSeed() {
    push();
    if (this.ifFly) {
      translate(this.lastCoreX + this.seedX, this.lastCoreY + this.seedY);
    } else {
      translate(this.coreX + this.seedX, this.coreY + this.seedY);
    }
    let fluct1 = sin((PI / 2) * (this.layerNum + 1) + this.seedPos);
    if (this.isHovering) {
      push();
      noStroke();
      for (let i = 0; i < 100; i++) {
        fill(250, 30, 20, floor(map(i, 0, 99, 0, 5)));
        circle(0, 0, floor(i * 0.5 + this.layerNum));
        fill(250, 30, 20);
        circle(0, 0, 20);
      }
      pop();
    } else {
      push();
      if (this.data != " ") {
        push();
        this.assignColor(fluct1);
        noStroke();
        circle(
          0,
          0,
          map(
            sin(this.seedPos + frameCount * 0.05),
            -1,
            1,
            3,
            6 + this.layerNum * 3.5
          )
        );
        pop();
      } else {
        push();
        fill(255);
        noStroke();
        circle(
          0,
          0,
          map(
            sin(this.seedPos + frameCount * 0.05),
            -1,
            1,
            3,
            6 + this.layerNum * 3.5
          )
        );
        this.size = map(
          sin(this.seedPos + frameCount * 0.05),
          -1,
          1,
          3,
          6 + this.layerNum * 3.5
        )
        pop();
      }

      pop();
    }
    pop();
  }

  drawSeedStem() {
    if (this.seedX > 0) {
      this.angle = PI / 2 + atan(this.seedY / this.seedX);
    } else {
      this.angle = -PI / 2 + atan(this.seedY / this.seedX);
    }
    push();
    if (this.ifFly) {
      translate(this.lastCoreX + this.seedX, this.lastCoreY + this.seedY);
    } else {
      translate(this.coreX + this.seedX, this.coreY + this.seedY);
    }
    stroke(255, 100);
    strokeWeight(map(sin(this.seedPos + frameCount * 0.05), -1, 1, 0.01, 2));
    rotate(this.angle + this.flyAngle);
    if (this.ifFly) {
      line(
        0,
        0,
        0,
        dist(
          this.lastCoreX,
          this.lastCoreY,
          this.lastSeedX + this.lastCoreX,
          this.lastSeedY + this.lastCoreY
        )
      );
    } else {
      line(
        0,
        0,
        0,
        dist(
          this.coreX,
          this.coreY,
          this.seedX + this.coreX,
          this.seedY + this.coreY
        )
      );
    }
    pop();
  }

  assignColor(fluct) {
    fill(
      map(
        fluct,
        -1,
        1,
        colorRange[this.colorIndex][0][0],
        colorRange[this.colorIndex][1][0]
      ),
      map(
        fluct,
        -1,
        1,
        colorRange[this.colorIndex][0][1],
        colorRange[this.colorIndex][1][1]
      ),
      map(
        fluct,
        -1,
        1,
        colorRange[this.colorIndex][0][2],
        colorRange[this.colorIndex][1][2]
      )
    );
  }

  checkHide() {
    if (this.dmouse <= 20) {
      this.hide();
    } else {
      this.hideX = 0;
      this.hideY = 0;
    }
  }

  hide() {
    this.hideX = map(this.dmouse, 0, 20, 10, 0);
    this.hideY = map(this.dmouse, 0, 20, 10, 0);
  }

  checkHover(stopHover) {
    // console.log(this.dmouse)
    if (this.dmouse <= 10 && !stopHover) {

      this.isHovering = true;
      
      if(mouseIsPressed){
        this.ifClicked = true;
      }
    } else {
      this.isHovering = false;
    }
  }
  checkClick(sdt){
    if(this.ifClicked){
      if (this.ifSelf || this.data != " ") {
        this.readText();
      } else if (!this.ifSelf) {
        this.writeText(sdt);
      } 
    }
  }

  writeText(sdt) {
    if(!this.isWriting){
      this.isWriting = true;
      console.log(this.data);
      let commentArea = document.querySelector('#commentArea');
      let textArea = document.querySelector('#textAreaWriteSeed');
      let submitButton = document.querySelector("#btn-comment");
      commentArea.style.display = "block";
      textArea.value = "";
      // Remove existing event listener (if any)
      submitButton.removeEventListener("click", this.submitHandler);
      
      // Define submitHandler function
      this.submitHandler = function () {
        const timestamp = getTimestamp();
        // console.log(timestamp);
        this.data = timestamp + textArea.value;
        sdt[this.index] = this.data;
        writeSeed(this.dbKey, sdt);
        this.isWriting = false;
        this.ifClicked = false;
        commentArea.style.display = "none";
      }.bind(this);
      // Add event listener
      submitButton.addEventListener("click", this.submitHandler);
    }
  }

  readText() {
    if (!this.isReading) {
      let readAreaContainer = document.createElement("div");
      readAreaContainer.id = "readAreaContainer";
      let userInputContent = document.createTextNode(this.data[0]);
      // console.log("userInputContent", userInputContent)
      userInputContent.id = "userInput";
      let buttonContainer = document.createElement("div");
      buttonContainer.id = "buttonContainer";
      let backButton = document.createElement("button");
      backButton.textContent = "Back";
      backButton.id = "button-back";
      backButton.addEventListener(
        "click",
        function () {
          stopHover = false;
          this.isReading = false;
          this.ifClicked = false;
          let divToRemove = document.getElementById("readAreaContainer");
          if (divToRemove) {
            this.removedReadDiv = divToRemove;
            divToRemove.parentNode.removeChild(divToRemove);
          }
        }.bind(this)
      );
      this.isReading = true;
    }
  }
  textBG(){
    push();
    noStroke();
    for (let i = 0; i < 80; i++) {
      fill(colorRange[this.colorIndex][1][0], colorRange[this.colorIndex][1][1], colorRange[this.colorIndex][1][2], floor(map(i, 0, 60, 0, 5)));
      circle(
        width / 2,
        height / 2,
        floor(i * 3 + 750)
      );
    }
    for (let i = 0; i < 35; i++) {
      fill(255, 220 - i * 6);
      circle(width / 2, height / 2, 616 + i * 5);
    }
    pop();
  }

  checkFly() {
    if (
      this.x + this.seedX + this.lastCoreX > windowWidth + 50 ||
      this.x + this.seedX + this.lastCoreX < -50 ||
      this.y + this.seedY + this.lastCoreY > windowHeight + 50 ||
      this.y + this.seedY + this.lastCoreY < -50
    ) {
      if (this.ifFly) {
        this.flyDone = true;
      }
    }
  }

  fly() {
    this.xSpd += random(-0.01, 0.01) + random(0, this.dirx);
    this.ySpd += random(-0.01, 0.01) - random(0, this.diry);
    this.flyAngle = map(noise(sin(frameCount * 0.01)), 0, 1, -PI / 30, PI / 30);
  }
}
