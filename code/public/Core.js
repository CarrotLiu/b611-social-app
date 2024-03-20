class Core {
  constructor(x, y, layerNum, ci, freq, size, name, cdt, self) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.coreX = 0;
    this.coreY = 0;
    this.freq = freq;
    this.size = size;
    this.layerNum = layerNum;
    this.coreData = cdt;
    this.colorIndex = ci;

    this.dmouse = dist(
      this.x + this.seedX,
      this.y + this.seedY,
      mouseX,
      mouseY
    );
    
    this.ifSelf = self;

    this.isHovering = false;
    this.ifClicked = false;
    this.isWriting = false;
    this.isReading = false;

    this.ifCheckDataNum = false;
    this.dataNum = 0;
    this.dataMax = 10;

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

    this.checkHover(stopHover, ifClicked);
    
    this.coreX = map(sin(frameCount * 0.01 + this.freq), -1, 1, -60, 60);
    this.coreY = map(cos(frameCount * 0.01 + this.freq), -1, 1, -10, 0);

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
      if (this.coreData[0] != "") {
        this.readText();
      } else if (this.ifSelf) {
        this.writeText();
      }
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
        if(this.coreData[0] == ""){
          this.coreData[0] = textArea.value;
        }else{
          this.coreData,push(textArea.value);
        }
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
      let readAreaContainer = document.querySelector('#readArea');
      let reviseButton = document.querySelector("#btn-revise");
      let backButton = document.querySelector("#btn-back");
      let deleteButton = document.querySelector("#btn-delete")

      if(this.self == false){
        deleteButton.style.display="none"
        reviseButton.style.display="none"
      }
      readAreaContainer.style.display = "block";

      let userInputContent = document.createTextNode(this.coreData[0]);
      userInputContent.id = "userInput";
      let buttonContainer = document.createElement("div");
      buttonContainer.id = "buttonContainer";
      backButton.addEventListener(
        "click",
        function () {
          stopHover = false;
          this.isReading = false;
          this.ifClicked = false;
          readAreaContainer.style.display = "none";
        }.bind(this)
      );

      reviseButton.addEventListener(
        "click",
        function () {
          stopHover = false;
          this.isReading = false;
          this.ifClicked = false;
          readAreaContainer.style.display = "none";
          this.writeText();
        }.bind(this)
      );
      deleteButton.addEventListener(
        "click",
        function () {
          stopHover = false;
          this.isReading = false;
          this.ifClicked = false;
          this.coreData.splice(0, 1);
          this.dataNum --;
          readAreaContainer.style.display = "none";
        }.bind(this)
      );

        if(!stopHover){
          stopHover = true;
        } 
        readAreaContainer.innerHTML = "";
        readAreaContainer.appendChild(userInputContent);
        
      
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
    if (this.coreData[0] != "") {
      this.dataNum = this.coreData.length;

    }
  }
}
