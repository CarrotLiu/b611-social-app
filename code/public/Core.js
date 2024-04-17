class Core {
  constructor(x, y, layerNum, ci, freq, size, name, cdt, self, ifLock, userId, dbKey, cimg) {
    this.name = name;
    this.id = userId;
    this.dbKey = dbKey;
    this.x = x;
    this.y = y;
    this.coreX = 0;
    this.coreY = 0;
    this.freq = freq;
    this.size = size;
    this.layerNum = layerNum;
    this.coreData = cdt;
    this.coreImage = cimg;
    this.colorIndex = ci;

    this.dmouse = dist(
      this.x + this.coreX,
      this.y + this.coreY,
      mouseX,
      mouseY
    );
    
    this.ifSelf = self;
    this.ifLock = ifLock;

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

  display(cnv) {
    push();
    translate(this.x, this.y);
    this.drawCore();
    pop();
    push();
    translate(-cnv, 0);
    if(this.isReading || this.isWriting){
      this.textBG();
    }
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
      if(this.ifSelf){
        if (this.coreData[0] != " ") {
          this.readText(this.dbKey);
        }else{
          
          this.writeText(this.dbKey);
        }
      }else{
        if(!this.ifLock){
          this.readText(this.dbKey);
        }
      }
    }
  }
  
  writeText(myDBKey) {
    // Show input box
    if(!this.isWriting){
      this.isWriting = true;
      let writeArea = document.querySelector('#writeArea');
      let textArea = document.querySelector('#textAreaWriteCore');
      let submitButton = document.querySelector("#btn-finish");
      let uploadButton = document.querySelector("#btn-uploadimg");
      let fileInput = document.querySelector("#imageInput");
      let fileSubmitBtn = document.querySelector("#btn-uploadimg");
      let backButton = document.querySelector("#btn-back-writeCore");

      writeArea.style.display = "block";
      textArea.value = "";
      
      submitButton.removeEventListener("click", this.submitHandler);
      backButton = removeAllEventListeners(backButton);
      let userId = this.dbKey;
      this.uploadHandler = async function (){
        let file = fileInput.files[0];
        try{
          
          let imageUrl = URL.createObjectURL(file);
          // console.log(imageUrl);
          let modifiedImageBlob = await previewImage(imageUrl);
          // this.coreImage = await writeImage(modifiedImageBlob, userId);
          // let imageUrl = URL.createObjectURL(file);
          // await previewImage(imageUrl);
          // this.coreImage = await writeImage(file, userId);
        } catch(error){
          console.log(error);
        }
      }
      fileInput.removeEventListener("change", this.uploadHandler, false);
      fileInput.addEventListener("change", this.uploadHandler, false);
      // uploadButton.removeEventListener("click", this.uploadHandler);
      // uploadButton.addEventListener("click", this.uploadHandler);
      
      
      this.submitHandler = function () {
        const timestamp = getTimestamp();
        // console.log(timestamp);
        if (this.coreData[0] === " ") {
          this.coreData[0] = timestamp + textArea.value;
        } else {
          this.coreData.push("\n\n" + timestamp + textArea.value);
        }
        let cdt = this.coreData;
        writeCore(this.dbKey, cdt);
        
        this.ifCheckDataNum = true;
        this.isWriting = false;
        this.ifClicked = false;
        writeArea.style.display = "none";
      }.bind(this);
      
      backButton.addEventListener(
        "click",
        function () {
          stopHover = false;
          this.isWriting = false;
          this.ifClicked = false;
          writeArea.style.display = "none";
        }.bind(this)
      );
      
      submitButton.addEventListener("click", this.submitHandler);
    }
  }

  readText(myDBKey) {
    if (!this.isReading) {
      this.isReading = true;
      // console.log(this.removedReadDiv);
      let readAreaContainer = document.querySelector('#readArea');
      let innerContainer = document.querySelector('#textAreaReadCore');
      let textDiv =document.querySelector('#coreContent');
      let writeButton = document.querySelector("#btn-write");
      let backButton = document.querySelector("#btn-back");
      let lockButton;
      if(document.querySelector("#btn-lock")){
        lockButton = document.querySelector("#btn-lock");
      }else if(document.querySelector("#btn-open")){
        lockButton = document.querySelector("#btn-open");
      }

      writeButton = removeAllEventListeners(writeButton);
      backButton = removeAllEventListeners(backButton);
      lockButton = removeAllEventListeners(lockButton);
      textDiv = removeAllEventListeners(textDiv);
      
      if(!this.ifSelf){
        lockButton.style.display="none";
        writeButton.style.display="none";
      }else{
        lockButton.style.display="inline-block";
        writeButton.style.display="inline-block";
      }
      
      if(!this.ifLock){
        // console.log(this.ifLock);
        lockButton.setAttribute("id", "btn-open");
        // console.log(lockButton);
      }else{
        lockButton.setAttribute("id", "btn-lock");
        // console.log(lockButton);
      }

      textDiv.addEventListener('scroll', handleScroll(textDiv));
      textDiv.innerHTML = "";
      let userInputContent = "";
      let userInputImage = document.createElement("img");

      readAreaContainer.style.display = "block";
      for(let i = 0; i < this.coreData.length; i++){
        userInputContent = document.createTextNode(this.coreData[i]);
        textDiv.appendChild(userInputContent);
        if(this.coreImage[i] != " "){
          userInputImage.src=this.coreImage[i];
          textDiv.appendChild(document.createElement("br"));
          textDiv.appendChild(userInputImage);
        }
      }

      lockButton.addEventListener(
        "click", 
        function () {
          stopHover = false;
          this.isReading = false;
          this.ifClicked = false;
          this.ifLock = !this.ifLock;
          // console.log(this.ifLock);
          writeLock(myDBKey, this.ifLock);
          socket.emit("updateLock", [this.id, this.ifLock]);
          readAreaContainer.style.display = "none";
        }.bind(this)
      );

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
      if(!stopHover){
        stopHover = true;
      } 
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