class Core {
  constructor(x, y, layerNum, ci, freq, user, ai, cdt, other, self) {
    this.user = user;
    this.ifAI = ai;
    this.x = x;
    this.y = y;
    this.coreX = 0;
    this.coreY = 0;
    this.freq = freq;
    this.layerNum = layerNum;
    this.coreData = cdt;
    this.colorIndex = ci;

    this.dmouse = dist(
      this.x + this.seedX,
      this.y + this.seedY,
      mouseX,
      mouseY
    );

    this.ifOther = other;
    this.ifSelf = self;

    this.isHovering = false;
    this.ifClicked = false;
    this.isWriting = false;
    this.isReading = false;
    this.data = [];

    this.ifCheckDataNum = false;
    this.dataNum = this.coreData.length;
    this.dataMax = 30;

    this.removedWriteDiv = null;
    this.removedReadDiv = null;

    
  }

  display() {
    push();
    translate(this.x, this.y);
    this.drawCore();
    pop();
  }

  update(stopHover, achieveData, ifClicked) {
    this.dmouse = dist(
      this.x + this.coreX,
      this.y + this.coreY,
      mouseX,
      mouseY
    );
    if (this.ifOther || this.ifSelf) {
      if(this.ifOther){
        if(this.data.length > 0){
          this.checkHover(stopHover, ifClicked);
        }else{
          this.checkHide();
        }
      }else{
        this.checkHover(stopHover, ifClicked);
      }
    }
    this.coreX = map(sin(frameCount * 0.01 + this.freq), -1, 1, -60, 60);
    this.coreY = map(cos(frameCount * 0.01 + this.freq), -1, 1, -10, 0);
    
    this.checkAchieve(achieveData);
    this.checkClick();
    // console.log(this.ifCheckDataNum);
    if (this.ifCheckDataNum) {
      this.checkDataNum();
      this.ifCheckDataNum = false;
    }
  }
  drawCore() {
    push();
    noStroke();
    if (this.isHovering) {
      for (let i = 0; i < 80; i++) {
        fill(250, 30, 20, floor(map(i, 0, 99, 0, 5)));
        circle(
          this.coreX,
          this.coreY,
          floor(i * 0.5 + map(this.layerNum, 1, 8, 30, 45))
        );
      }
      fill(250, 30, 20);
    } else {
      // let fluct2 = sin(PI / 2 + frameCount * 0.01);
      // this.assignColor(fluct2);
      for (
        let i = 0;
        i < 10 + constrain(map(this.dataNum, 0, this.dataMax, 0, 70), 0, 70);
        i++
      ) {
        fill(244, 206, 20, floor(map(i, 0, 99, 0, 5)));
        circle(
          this.coreX,
          this.coreY,
          floor(i * 0.5 + map(this.layerNum, 1, 8, 30, 45))
        );
      }
      fill(244, 206, 20);
    }
    circle(this.coreX, this.coreY, map(this.layerNum, 1, 8, 30, 45));

    if (this.dataNum <= this.dataMax) {
      let alphaMask = map(this.dataNum, 0, this.dataMax, 255, 0);
      if (this.isHovering) {
        fill(250, 30, 20);
      } else {
        fill(255, alphaMask);
      }

      circle(this.coreX, this.coreY, map(this.layerNum, 1, 8, 30, 45));
    }
    pop();
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

  checkClick() {
    if (this.ifClicked) {
      if (this.data.length != 0) {
        this.readText();
      } else if (this.ifSelf) {
        this.writeText();
      }
    }
  }

  checkAchieve(achieveData) {
    
    if (achieveData.length != 0) {
      
      for (let i = 0; i < achieveData.length; i++) {
        if(this.data.length == 0){
          this.data[0] = achieveData[i];
        } else{
          this.data[0] += achieveData[i];
        }
      }
      this.ifCheckDataNum = true;
    }
  }
  writeText() {
    // Show input box
    let writeArea = document.querySelector('#writeArea')
    let submitButton = document.querySelector("#btn-finish")
    writeArea.style.display = "block";

    submitButton.addEventListener(
      "click",
      function () {
        this.data[0] = textArea.value;
        this.ifCheckDataNum = true;
        this.isWriting = false;
        this.ifClicked = false;
        writeArea.style.display = "none";
      }.bind(this)
    );  
  }

  readText() {
    if (!this.isReading) {
      // console.log(this.removedReadDiv);
      let readAreaContainer = document.createElement("div");
      readAreaContainer.id = "readAreaContainer";
      let userInputContent = document.createTextNode(this.data[0]);
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
          this.dataNum = 0;
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
        buttonContainer.appendChild(reviseButton);
        buttonContainer.appendChild(deleteButton);
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
        buttonContainer.appendChild(reviseButton);
        buttonContainer.appendChild(deleteButton);
        readAreaContainer.appendChild(buttonContainer);
      }
      this.isReading = true;
    }
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

  checkDataNum() {
    if (this.data.length != 0) {
      for (let i = 0; i < this.data[0].length; i++) {
        // console.log(this.data[0][i]);
        if (this.data[0][i] == "\n") {
          this.dataNum++;
        }
      }
      if (this.dataNum == 0) {
        this.dataNum = 1;
      }
    }
  }
}
