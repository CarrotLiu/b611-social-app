class Prince {
  constructor(x, y, freq, name, color, ifSelf, id) {
    this.name = name;
    this.id = id;
    this.x = x;
    this.y = y;
    this.ifSelf = ifSelf;
    this.xOut = x;
    this.cnvX = 0;
    this.spdX = 2;
    this.spdY = 0;
    this.accX = 0;
    this.accY = 0;
    this.hairX = 0;
    this.hairY = -90;
    this.eyeX = 0;
    this.eyeY = 0;
    this.eyeHX = 0;
    this.eyeHY = 0;
    this.eyeVX = 16;
    this.eyeVY = 3;
    this.freq = freq;
    this.blinkInterval = 360;
    this.blinkCount = 0;
    this.ifBlink = false;
    this.finishBlink = false;
    this.clothX = 0;
    this.ifIdle = true;
    this.ifTalk = false;
    this.ifWalk = false;
    this.walkDir = 1;
    this.walkCount = 0;
    this.scarfDir = 1;
    this.dataMax = 30;
    this.coreData = 0;
    this.maskAlpha = 255;
    this.colorScarf = color[0];
    this.colorScarfD = color[1];
    this.colorCloth = color[2];
    this.colorShadow = color[3];
    this.colorStem = color[4];
  }

  display(dataNum) {
    push();
    if(this.ifSelf){
      translate(this.x, this.y);
    }else{
      translate(this.xOut, this.y);
    }
   
    this.drawHead();
    this.drawEye();
    this.drawCloth(dataNum);
    pop();
  }

  update() {
    if (this.blinkInterval <= 0) {
      this.ifBlink = true;
    }
    let hairx = map(sin(frameCount * 0.01 + this.freq), -1, 1, -20, 20);
    let hairy = map(cos(frameCount * 0.01 + this.freq), -1, 1, -100, -90);
    let eyeOffsetX = map(mouseX, 0, width, -20, 20);
    let eyeOffsetY = map(mouseY, 0, height, -26, 10);
    let yFloat = sin(frameCount * 0.008 + this.freq) * 0.3;
    this.eyeHX = 0;
    this.eyeHY = 0;
    this.eyeVX = 16;
    this.eyeVY = 3;

    push();
    if (this.ifIdle) {
      this.idle(eyeOffsetX, eyeOffsetY, hairx, hairy, yFloat);
    } else if (this.ifWalk) {
      this.walk(hairx, hairy, yFloat);
      console.log(`${this.name}'s xOut value is: ${this.xOut}`);
      this.clothX = 20;
    }

    if (this.ifBlink) {
      if (!this.finishBlink) {
        this.blink();
      } else {
        this.blinkInterval = floor(random(180, 660));
        this.ifBlink = false;
        this.finishBlink = false;
      }
    }
    pop();

    this.blinkInterval--;
  }

  drawHead() {
    push();
    strokeWeight(2);
    stroke(this.colorStem[0], this.colorStem[1], this.colorStem[2]);
    noFill();
    this.maskAlpha = map(this.coreData, 0, this.dataMax, 255, 0);
    bezier(this.hairX, this.hairY, 0, -70, 0, -30, 0, -30);
    if (this.coreData < this.dataMax) {
    }
    for (let i = 0; i < 100; i++) {
      noStroke();
      fill(255, 35 - floor(map(i, 0, 99, 5, 0)));
      ellipse(0, 0, 25 + i);
    }
    for (
      let i = 0;
      i < 30 + constrain(map(this.coreData, 0, this.dataMax, 0, 70), 0, 70);
      i++
    ) {
      noStroke();
      fill(this.colorScarf[0], this.colorScarf[1], this.colorScarf[2] + 10, 10 - floor(map(i, 0, 99, 5, 0)));
      circle(this.hairX, this.hairY, i * 0.35);
    }

    fill(this.colorScarf[0], this.colorScarf[1], this.colorScarf[2]);
    circle(this.hairX, this.hairY, 15);

    push();
    if (this.coreData < this.dataMax) {
      noStroke();
      fill(255, this.maskAlpha);
      circle(this.hairX, this.hairY, 15);
    }
    pop();
    stroke("#001C30");
    strokeWeight(5);
    pop();
  }

  drawEye() {
    push();
    stroke("#001C30");
    strokeWeight(5);
    translate(this.eyeX, this.eyeY);
    ///open eye
    line(-this.eyeVX, -this.eyeVY, -this.eyeVX, this.eyeVY);
    line(this.eyeVX, -this.eyeVY, this.eyeVX, this.eyeVY);

    ///closed eye
    //right
    push();
    translate(this.eyeVX, 0);
    line(this.eyeHX, this.eyeHY, -this.eyeHX, this.eyeHY);
    pop();
    //left
    push();
    translate(-this.eyeVX, 0);
    line(this.eyeHX, this.eyeHY, -this.eyeHX, this.eyeHY);
    pop();
    pop();              
  }

  blink() {
    let amtV = map(sin(frameCount * 0.25), -1, 1, 0, 1);
    let amtH = map(sin(frameCount * 0.25), -1, 1, 0, 1);
    if (amtV <= 0.6) {
      this.eyeVY = lerp(this.eyeVY, 0, amtV);
    } else if (amtH <= 1) {
      this.eyeHX = lerp(this.eyeHX, 2.5, amtH);
      this.eyeVY = lerp(this.eyeVY, 0, amtV);
    }
    if (amtH >= 0.99) {
      this.blinkCount += 1;
    }
    if (this.blinkCount >= 2) {
      this.finishBlink = true;
      this.blinkCount = 0;
    }
  }

  scarfFloat() {
    push();
    scale(this.scarfDir, 1);
    noStroke();
    fill(this.colorScarfD[0], this.colorScarfD[1], this.colorScarfD[2]);
    beginShape();
    vertex(53, 28);
    bezierVertex(
      85,
      20 + this.floatRate(0.03, -50, 40),
      85,
      20 + this.floatRate(0.04, -50, 40),
      150,
      22 + this.floatRate(0.02, -50, 46)
    );
    vertex(138, 60 + this.floatRate(0.02, -50, 48));
    bezierVertex(
      85,
      45 + this.floatRate(0.03, -50, 40),
      85,
      45 + this.floatRate(0.04, -50, 40),
      50,
      45
    );
    endShape();
    pop();
    if (this.coreData <= this.dataMax) {
      push();
      scale(this.scarfDir, 1);
      noStroke();
      fill(130, this.maskAlpha);
      beginShape();
      vertex(53, 28);
      bezierVertex(
        85,
        20 + this.floatRate(0.03, -50, 40),
        85,
        20 + this.floatRate(0.04, -50, 40),
        150,
        22 + this.floatRate(0.02, -50, 46)
      );
      vertex(138, 60 + this.floatRate(0.02, -50, 48));
      bezierVertex(
        85,
        45 + this.floatRate(0.03, -50, 40),
        85,
        45 + this.floatRate(0.04, -50, 40),
        50,
        45
      );
      endShape();
      pop();
    }
  }

  scarfNeck() {
    push();
    noStroke();
    fill(this.colorScarf[0], this.colorScarf[1], this.colorScarf[2]);
    beginShape();
    vertex(-54, 28);
    bezierVertex(-15, 40, 15, 40, 54, 28);
    vertex(55, 53);
    bezierVertex(15, 65, -15, 65, -55, 53);
    endShape();
    pop();
    if (this.coreData <= this.dataMax) {
      push();
      noStroke();
      fill(150, this.maskAlpha);
      beginShape();
      vertex(-54, 28);
      bezierVertex(-15, 40, 15, 40, 54, 28);
      vertex(55, 53);
      bezierVertex(15, 65, -15, 65, -55, 53);
      endShape();
      pop();
    }
  }

  cloth() {
    // cloth
    let anchorULX =
      -61 + this.floatRate(0.03, -15, 5) - this.clothX * this.walkDir * 0.3;
    let anchorULY = 80 - this.clothX * this.walkDir * 1.2;
    let anchorDLX =
      -70 + this.floatRate(0.02, -15, 6) - this.clothX * this.walkDir * 0.8;
    let anchorDLY = 100 + this.clothX * this.walkDir * 0.6;
    let anchorDRX =
      70 + this.floatRate(0.03, 15, -6) - this.clothX * this.walkDir * 0.8;
    let anchorDRY = 100 - this.clothX * this.walkDir * 0.6;
    let anchorURX =
      61 + this.floatRate(0.02, 15, -5) - this.clothX * this.walkDir * 0.3;
    let anchorURY = 80 + this.clothX * this.walkDir * 1.2;
    let controlULX = -55;
    let controlULY = 53;
    let controlDLX =
      -75 + this.floatRate(0.025, -6, 6) - this.clothX * this.walkDir * 1.6;
    let controlDLY = 150;
    let controlDRY = 150;
    if (this.walkDir == -1) {
      controlDLY = 150 + this.clothX * this.walkDir * 0.1;
      controlDRY = 150 + this.clothX * this.walkDir;
    } else {
      controlDLY = 150 - this.clothX * this.walkDir;
      controlDRY = 150 - this.clothX * this.walkDir * 0.1;
    }
    let controlDRX =
      75 + this.floatRate(0.025, 6, -6) - this.clothX * this.walkDir * 1.6;
    let controlURX = 55;
    let controlURY = 53;
    let anchorDLEX = -35;
    let anchorDLEY = 160 + this.floatRate(0.02, -10, 10);
    let anchorDREX = 35;
    let anchorDREY = 170 + this.floatRate(0.03, 10, -10);
    let anchorUREX = 35;
    let anchorUREY = 130 + this.floatRate(0.025, 30, -16);
    let anchorULEX = -35;
    let anchorULEY = 120 + this.floatRate(0.03, -16, 30);

    //upper cloth
    push();
    noStroke();
    fill(this.colorCloth[0], this.colorCloth[1], this.colorCloth[2]);
    beginShape();
    vertex(controlULX, controlULY);
    bezierVertex(
      anchorULX,
      anchorULY,
      anchorDLX,
      anchorDLY,
      controlDLX,
      controlDLY
    );
    vertex(controlDRX, controlDRY);
    bezierVertex(
      anchorDRX,
      anchorDRY,
      anchorURX,
      anchorURY,
      controlURX,
      controlURY
    );
    endShape();

    //lower edge
    noStroke();
    fill(this.colorCloth[0], this.colorCloth[1], this.colorCloth[2]);
    beginShape();
    vertex(controlDLX, controlDLY);
    bezierVertex(
      anchorULEX,
      anchorULEY,
      anchorUREX,
      anchorUREY,
      controlDRX,
      controlDRY
    );
    vertex(controlDRX, controlDRY);
    vertex(controlDLX, controlDLY);
    endShape();

    //lower edge darker
    fill(this.colorShadow[0], this.colorShadow[1], this.colorShadow[2]);
    beginShape();
    vertex(controlDLX, controlDLY);
    bezierVertex(
      anchorULEX,
      anchorULEY,
      anchorUREX,
      anchorUREY,
      controlDRX,
      controlDRY
    );
    vertex(controlDRX, controlDRY);
    bezierVertex(
      anchorDREX,
      anchorDREY,
      anchorDLEX,
      anchorDLEY,
      controlDLX,
      controlDLY
    );
    endShape();
    pop();

    if (this.coreData <= this.dataMax) {
      //upper cloth
      push();
      noStroke();
      fill(100, this.maskAlpha);
      beginShape();
      vertex(controlULX, controlULY);
      bezierVertex(
        anchorULX,
        anchorULY,
        anchorDLX,
        anchorDLY,
        controlDLX,
        controlDLY
      );
      vertex(controlDRX, controlDRY);
      bezierVertex(
        anchorDRX,
        anchorDRY,
        anchorURX,
        anchorURY,
        controlURX,
        controlURY
      );
      endShape();

      //lower edge
      noStroke();
      fill(100, this.maskAlpha);
      beginShape();
      vertex(controlDLX, controlDLY);
      bezierVertex(
        anchorULEX,
        anchorULEY,
        anchorUREX,
        anchorUREY,
        controlDRX,
        controlDRY
      );
      vertex(controlDRX, controlDRY);
      vertex(controlDLX, controlDLY);
      endShape();

      //lower edge darker
      fill(60, this.maskAlpha);
      beginShape();
      vertex(controlDLX, controlDLY);
      bezierVertex(
        anchorULEX,
        anchorULEY,
        anchorUREX,
        anchorUREY,
        controlDRX,
        controlDRY
      );
      vertex(controlDRX, controlDRY);
      bezierVertex(
        anchorDREX,
        anchorDREY,
        anchorDLEX,
        anchorDLEY,
        controlDLX,
        controlDLY
      );
      endShape();
      pop();
    }
  }

  drawCloth(dataNum) {
    this.coreData = dataNum;
    this.maskAlpha = map(this.coreData, 0, this.dataMax, 255, 0);
    // console.log(this.coreData, this.maskAlpha);
    this.scarfFloat();
    this.cloth();
    this.scarfNeck();
  }

  floatRate(f, min, max) {
    let scarfFluctY = map(sin(frameCount * f + this.freq), -1.6, 1.6, min, max);
    return scarfFluctY;
  }

  idle(eyeOffsetX, eyeOffsetY, hairx, hairy, yFloat) {
    // this.eyeX = eyeOffsetX;
    // this.eyeY = eyeOffsetY;
    this.eyeX = 0;
    this.eyeY = 0;
    this.hairX = hairx;
    this.hairY = hairy;
    this.y += yFloat;
  }

  walk(hairx, hairy, yFloat) {
    if (this.walkDir == 1) {
      //ArrowRight
      this.scarfDir = -1;
    } else if (this.walkDir == -1) {
      // ArrowLeft     
      this.scarfDir = 1;
    }
    if (this.walkDir == 1) {
      this.eyeX = lerp(this.eyeX, 52, map(this.walkCount, 0, 60, 0, 1));
      this.eyeY = -5;
    } else {
      this.eyeX = lerp(this.eyeX, -52, map(this.walkCount, 0, 60, 0, 1));
      this.eyeY = -5;
    }

    this.hairX = hairx;
    this.hairY = hairy;
    if((dist(this.x, 0, windowWidth, 0) < 100 && this.walkDir == 1)||(dist(this.x, 0, 0, 0) < 100 && this.walkDir == -1)){
      this.cnvX = -this.walkDir * this.spdX;;
    }else{
      this.x += this.walkDir * this.spdX;
      this.cnvX = 0;
    }
    this.xOut += this.walkDir * this.spdX;
    this.y += yFloat * 0.1;
    
  }
}
