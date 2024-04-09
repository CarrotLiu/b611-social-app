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
      this.x + this.coreX,
      this.y + this.coreY,
      mouseX,
      mouseY
    );
    
    this.ifSelf = self;
    this.ifLock = false;

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

  update(cnvX, myDBKey, stopHover) {
    this.dmouse = dist(
      this.x + this.coreX,
      this.y + this.coreY,
      mouseX - cnvX,
      mouseY
    );
    if(!this.ifLock || this.ifSelf){
      this.checkHover(stopHover);
    }
    this.coreX = map(sin(frameCount * 0.01 + this.freq), -1, 1, -60, 60);
    this.coreY = map(cos(frameCount * 0.01 + this.freq), -1, 1, -10, 0);

    this.checkClick(myDBKey);
    
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
        fill(230, 55, 35, floor(map(i, 0, 99, 0, 5)));
        circle(
          this.coreX,
          this.coreY,
          floor(i * 0.5 + map(this.layerNum, 1, 8, 30, 45))
        );
      }
      fill(250,  55, 35);
    } else {
      // let fluct2 = sin(PI / 2 + frameCount * 0.01);
      // this.assignColor(fluct2);
      for (
        let i = 0;
        i < 10 + constrain(map(this.dataNum, 0, this.dataMax, 0, 70), 0, 70);
        i++
      ) {
        fill(colorPrince[this.colorIndex][1][0], colorPrince[this.colorIndex][1][1], colorPrince[this.colorIndex][1][2], floor(map(i, 0, 99, 0, 5)));
        circle(
          this.coreX,
          this.coreY,
          floor(i * 0.5 + map(this.layerNum, 1, 8, 30, 45))
        );
      }
      fill(colorPrince[this.colorIndex][1][0], colorPrince[this.colorIndex][1][1], colorPrince[this.colorIndex][1][2]);
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

  checkHover(stopHover) {
    if (this.dmouse <= 10 && !stopHover) {
      this.isHovering = true;
      if(mouseIsPressed){
        this.ifClicked = true;
      }
    } else {
      this.isHovering = false;
    }
  }
  checkClick(myDBKey){
    if(this.ifClicked){
      // console.log(this.coreData[0]);
      if (this.coreData[0] != " ") {
        this.readText(myDBKey);
        // console.log("reading")
      } else if (this.ifSelf) {
        this.writeText(myDBKey);
        // console.log("writing")
      }
    }
  }

  writeText(myDBKey) {
    // Show input box
    this.isWriting = true;
    let writeArea = document.querySelector('#writeArea')
    let textArea = document.querySelector('#textAreaWriteCore')
    let submitButton = document.querySelector("#btn-finish")
    writeArea.style.display = "block";
    textArea.value = "";
    // Remove existing event listener (if any)
    submitButton.removeEventListener("click", this.submitHandler);
    
    // Define submitHandler function
    this.submitHandler = function () {
      const timestamp = getTimestamp();
      // console.log(timestamp);
      if (this.coreData[0] === " ") {
        this.coreData[0] = timestamp + textArea.value;
        // console.log(this.coreData[0]);
      } else {
        this.coreData.push("\n\n" + timestamp + textArea.value);
      }
      let cdt = this.coreData;
      writeCore(myDBKey, cdt);
      
      this.ifCheckDataNum = true;
      this.isWriting = false;
      this.ifClicked = false;
      writeArea.style.display = "none";
    }.bind(this);
  
    // Add event listener
    submitButton.addEventListener("click", this.submitHandler);
  }
  

  readText(myDBKey) {
    if (!this.isReading) {
      this.isReading = true;
      // console.log(this.removedReadDiv);
      let readAreaContainer = document.querySelector('#readArea');
      let textDiv =document.querySelector('#textAreaReadCore');
      let writeButton = document.querySelector("#btn-write");
      let backButton = document.querySelector("#btn-back");
      let lockButton = document.querySelector("#btn-lock");
      console.log(this.ifLock);
      if(this.ifLock){
        console.log(this.ifLock);
        lockButton.setAttribute("id", "btn-open");
      }else{
        lockButton.setAttribute("id", "btn-lock");
      }
      
      if(!this.ifSelf){
        lockButton.style.display="none";
        writeButton.style.display="none";
      }
      if(this.ifLock){
        lockButton.style.backgroundImage = "url('lock-close.svg')";
      }else{
        lockButton.style.backgroundImage = "url('lock-open.svg')";
      }
      textDiv.innerHTML = "";
      let userInputContent = "";
      readAreaContainer.style.display = "block";
      for(let i = 0; i < this.coreData.length; i++){
        userInputContent = document.createTextNode(this.coreData[i]);
        textDiv.appendChild(userInputContent);
      }
      
      // userInputContent.id = "userInput";
      backButton.addEventListener(
        "click",
        function () {
          stopHover = false;
          this.isReading = false;
          this.ifClicked = false;
          readAreaContainer.style.display = "none";
        }.bind(this)
      );
      writeButton.addEventListener(
        "click",
        function () {
          stopHover = false;
          this.isReading = false;
          this.ifClicked = false;
          readAreaContainer.style.display = "none";
          this.writeText(myDBKey);
        }.bind(this)
      );
      lockButton.addEventListener(
        "click",
        function () {
          stopHover = false;
          this.isReading = false;
          this.ifClicked = false;
          this.ifLock = !this.ifLock;
          this.coreData.splice(0, 1);
          this.dataNum --;
          
          
          readAreaContainer.style.display = "none";
        }.bind(this)
      );
      if(!stopHover){
        stopHover = true;
      } 
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
    if (this.coreData[0] != " ") {
      this.dataNum = this.coreData.length;
    }
  }
}
