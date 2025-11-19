let player
let enemyShips = [];
function setup() {
  
  createCanvas(displayWidth,displayHeight);
  angleMode(DEGREES);
  player = new Player();
}

function draw() {
 background('#0071a7');
 player.checkMovement();
 player.update();
 player.display();
 for(i=0; i<enemyShips.length; i++){
  enemyShips[i].applyTanForce(.01);  
  enemyShips[i].update();  
  enemyShips[i].display();

}

}


class Player{
  constructor() {
    this.mainAngle = 180;
    this.squareSize = 50;
    this.pos = createVector(100, 100);
    this.vel = createVector(0, 0, 0);
    this.flightForce = .5;
    this.rectHeight = 50;
    this.rectWidth = 50;
    this.drag = .02;
    
  }
  update() {
    this.vel.x *=(1-this.drag);
    this.vel.y *=(1-this.drag);
    this.pos.add(this.vel);
  }
  display() {
    push()
    translate(this.pos.x,this.pos.y);
    rotate(this.mainAngle);
    rect(-this.rectHeight/2, -this.rectWidth/2, this.rectWidth,this.rectHeight);
    fill(220);
    rect(-this.rectHeight/2, -this.rectWidth/2, this.rectWidth-30,this.rectHeight);

    pop()
  }
  applyTanForce(force){
    this.vel.x +=(force*-cos(this.mainAngle));
    this.vel.y +=(force*-sin(this.mainAngle));
  }
  checkMovement()
  {
    //-------------WASD----------------
    if(keyIsDown(87) === true)
      this.applyTanForce(this.flightForce);
    
    if(keyIsDown(65)){
      this.mainAngle -= 3;
      this.drag = .05;
    }
    else if(keyIsDown(68)){
      this.mainAngle += 3;
      this.drag = .05;
    }
    if(keyIsDown(83))
      this.drag = .07;
    else
      this.drag = .02;
    //----------------------------------
    //          Afterburner
  }
 }


 class Enemy{
  constructor(){
     if (int(random(1,3)) === 1){  
        //ship appears on left or right
        this.posY = random(0,windowHeight);
        if(int(random(1,3)) === 1)
          this.posX = 0;
        else
          this.posX = windowWidth-50;
      }
      else
      {
        //ship appears on top or bottom
        this.posX = random(0,windowWidth-50);
        if(int(random(1,3)) === 1)
          this.posY = 50;
        else
          this.posY = windowHeight;
        console.log(this.posX);
        console.log(int(random(1,3)));
      }

    this.squareSize = 50;
    this.pos = createVector(this.posX, this.posY);
    this.vel = createVector(.001, .001, 0);
    this.flightForce = .01;
    this.rectHeight = 50;
    this.rectWidth = 50;
    this.drag = .02;
    // initial angle toward the player (use atan2 so we get direction)
    this.mainAngle = atan2(player.pos.y - this.pos.y, player.pos.x - this.pos.x);

  }
  update() {
    // recalc angle toward player each frame
    this.mainAngle = atan2(player.pos.y - this.pos.y, player.pos.x - this.pos.x);
    // apply thrust toward player, then drag, then move
    this.applyTanForce(this.flightForce);
    this.vel.x *=(1-this.drag);
    this.vel.y *=(1-this.drag);
    this.pos.add(this.vel);
  }
  display() {
    push()
    translate(this.pos.x,this.pos.y);
    rotate(this.mainAngle+180);
    fill(255,0,0)
    rect(-this.rectHeight/2, -this.rectWidth/2, this.rectWidth,this.rectHeight);
    fill(255,0,0);
    rect(-this.rectHeight/2, -this.rectWidth/2, this.rectWidth-30,this.rectHeight);
    pop()
  }
  applyTanForce(force){
    // add force in the direction of mainAngle (negative to point toward player)
    this.vel.x += (force * cos(this.mainAngle));
    this.vel.y += (force * sin(this.mainAngle));
  }
         
  }
function keyPressed()
{
  if(key === "p"){
       console.log("ran");
   enemyShips.push(new Enemy());
  }
}
 
