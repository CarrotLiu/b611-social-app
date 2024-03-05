class Seed {
  constructor(x, y, layer, sdPos, dirx, diry, ci, freq) {
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

    this.ifFriend = false;
    this.ifSelf = true;

    this.isHovering = false;
    this.ifClicked = false;
    this.isWriting = false;
    this.isReading = false;
    this.data = [];
    this.achievedData = [];
    this.removedWriteDiv = null;
    this.removedReadDiv = null;

    this.ifFly = false;
    this.flyDone = false;

    this.colorIndex = ci;
  }

  update(stopHover,ifClicked) {
    //get mouse pos
    this.dmouse = dist(
      this.x + this.seedX + this.coreX,
      this.y + this.seedY + this.coreY,
      mouseX,
      mouseY
    );

    //fly
    this.checkFly();
    if (this.ifFly) {
      this.fly();
      this.seedX += this.xSpd;
      this.seedY += this.ySpd;
    } else {
      if (this.ifFriend || this.ifSelf) {
        if(this.ifFriend){
          if(this.data.length > 0){
            this.checkHover(stopHover, ifClicked);
          }else{
            this.checkHide();
          }
        }else{
          this.checkHover(stopHover, ifClicked);
        }
        
      } else {
        this.checkHide();
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
    this.checkClick(ifClicked);
    // if(this.layerNum == 1){
      // console.log(this.coreX, this.coreY);
      // console.log(this.seedX + this.coreX, this.seedY + this.coreY);
    // }
    if(this.isHovering){
      console.log("hhh");
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    this.drawSeedStem();
    this.drawSeed();
    pop();
    // console.log(this.layerNum);
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

      if (this.data.length != 0) {
        // push();
        // fill(255, 60);
        // circle(
        //   0,
        //   0,
        //   5 +
        //     map(
        //       sin(this.seedPos + frameCount * 0.05),
        //       -1,
        //       1,
        //       3,
        //       6 + this.layerNum * 3.5
        //     )
        // );
        // pop();
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

  checkHover(stopHover, ifClicked) {
    if (this.dmouse <= 10 && !stopHover) {
      this.isHovering = true;
      if(ifClicked){
        this.ifClicked = true;
      }
    } else {
      this.isHovering = false;
      ifClicked = false;
    }
  }
  checkClick(){
    if(this.ifClicked){
      if (this.data.length != 0) {
        this.readText();
      } else if (this.ifSelf) {
        this.writeText();
      }  
    }
  }


  writeText() {
    if (!this.isWriting) {
      let writeAreaContainer = document.createElement("div");
      writeAreaContainer.id = "writeAreaContainer";
      let textArea = document.createElement("textarea");
      textArea.id = "textInputArea";
      let br = document.createElement("br");
      if (this.data.length != 0) {
        textArea.value = this.data[0];
      } else {
        textArea.placeholder =
          "Write about the characteristics you hope to possess";
      }
      textArea.style.width = "500px";
      textArea.style.height = "300px";
      // Create a submit button
      let submitButton = document.createElement("button");
      submitButton.id = "button-submit";
      submitButton.textContent = "Submit";
      submitButton.addEventListener(
        "click",
        function () {
          // console.log("textArea.value", textArea.value)
          stopHover = false;
          
          let userInput = textArea.value; //.replace(/\r?\n/g, "\n");
          this.data[0] = userInput;

          this.isWriting = false;
          this.ifClicked = false;

          let divToRemove = document.getElementById("writeAreaContainer");
          if (divToRemove) {
            this.removedWriteDiv = divToRemove;
            divToRemove.parentNode.removeChild(divToRemove);
          }
        }.bind(this)
      );

      if (this.removedWriteDiv) {
        this.removedWriteDiv.innerHTML = "";
        this.removedWriteDiv.appendChild(textArea);
        this.removedWriteDiv.appendChild(br);
        this.removedWriteDiv.appendChild(submitButton);
        document.body.appendChild(this.removedWriteDiv);
        this.removedWriteDiv = null;
      } else {
        if(!stopHover){
          stopHover = true;
        } 
        writeAreaContainer.innerHTML = "";
        writeAreaContainer.appendChild(textArea);
        writeAreaContainer.appendChild(br);
        writeAreaContainer.appendChild(submitButton);
        document.body.appendChild(writeAreaContainer);
      }

      this.isWriting = true;
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

        let reviseButton = document.createElement("button");
        reviseButton.textContent = "Revise";
        reviseButton.id = "button-revise";
        reviseButton.addEventListener(
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
            this.writeText();
          }.bind(this)
        );
        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.id = "button-delete";
        deleteButton.addEventListener(
          "click",
          function () {
            stopHover = false;
            this.isReading = false;
            this.ifClicked = false;
            this.data.splice(0, 1);
            let divToRemove = document.getElementById("readAreaContainer");
            if (divToRemove) {
              this.removedReadDiv = divToRemove;
              divToRemove.parentNode.removeChild(divToRemove);
            }
          }.bind(this)
        );
        let achieveButton = document.createElement("button");
        achieveButton.textContent = "Achieved";
        achieveButton.id = "button-achieve";
        achieveButton.addEventListener(
          "click",
          function () {
            stopHover = false;
            
            this.isReading = false;
            this.ifClicked = false;
            this.achievedData[0] = "\n" + this.data[0];
            this.data.splice(0, 1);
            let divToRemove = document.getElementById("readAreaContainer");
            if (divToRemove) {
              
              this.removedReadDiv = divToRemove;
              divToRemove.parentNode.removeChild(divToRemove);
            }
          }.bind(this)
        );
      
      
      if (this.removedReadDiv) {
        
        this.removedReadDiv.innerHTML = "";
        this.removedReadDiv.appendChild(userInputContent);
        buttonContainer.appendChild(backButton);
        if(this.ifSelf){
          buttonContainer.appendChild(reviseButton);
          buttonContainer.appendChild(deleteButton);
          buttonContainer.appendChild(achieveButton);
        }
       
        this.removedReadDiv.appendChild(buttonContainer);
        document.body.appendChild(this.removedReadDiv);
        this.removedReadDiv = null;
      } else {
        if(!stopHover){
          stopHover = true;
        } 
        readAreaContainer.innerHTML = "";
        document.body.appendChild(readAreaContainer);
        readAreaContainer.appendChild(userInputContent);
        buttonContainer.appendChild(backButton);
        if(this.ifSelf){
          buttonContainer.appendChild(reviseButton);
          buttonContainer.appendChild(deleteButton);
          buttonContainer.appendChild(achieveButton);
        }
        readAreaContainer.appendChild(buttonContainer);
      }
      this.isReading = true;
    }
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
