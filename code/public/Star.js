class Star{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.alphaMax = floor(random(100, 255));
        this.alpha = this.alphaMax;
        this.freq = random(PI * 2);
        this.freq2 = random(5);
        this.size = floor(random(1, 5));
    }
    update(){
        this.alpha = map(sin(frameCount * 0.01 * this.freq2 + this.freq),-1, 1, 0, this.alphaMax);
    }
    display(){
        this.drawStar();
    }
    drawStar(){
        push();
        noStroke();
        translate(this.x, this.y);
        fill(255, this.alpha);
        circle(0, 0, this.size);
        pop();
    }
}