let player;
let spritePlayer, spriteEnemy;
let enemyShips = [];
let playerBullet = [];

function preload() {
  spritePlayer = loadImage('/assets/player.gif');
  spriteEnemy = loadImage('/assets/enemy.gif');
}

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
for(i=0; i<playerBullet.length; i++){
  playerBullet[i].applyTanForce(.1);
  playerBullet[i].update();
  playerBullet[i].display();
}

}


class Player{
  constructor() {
    this.squareSize = 50;
    this.pos = createVector(100, 100);
    this.vel = createVector(0, 0, 0);
    this.rectHeight = 50;
    this.rectWidth = 50;
    this.drag = 0.1;
  }
  update() {
    this.mainAngle = atan2(mouseY - this.pos.y, mouseX - this.pos.x);
    this.vel.x *=(1-this.drag);
    this.vel.y *=(1-this.drag);
    this.pos.add(this.vel);
  }
  display() {
    push()
    translate(this.pos.x,this.pos.y);
    rotate(this.mainAngle -90);
    image(spritePlayer, -32, -32);
    pop()
  }
 
  checkMovement()
  {
    //-------------WASD----------------
    if(keyIsDown(87) === true)
      this.vel.y -= .75;
    
    if(keyIsDown(65)){
      this.vel.x -= .75
    }
    else if(keyIsDown(68)){
      this.vel.x +=.75;
    }
    if(keyIsDown(83))
      this.vel.y +=.75
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
    this.flightForce = .03;
    this.rectHeight = 50;
    this.rectWidth = 50;
    this.drag = .01;
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
    rotate(this.mainAngle+270);
    image(spriteEnemy, -32, -32);
    pop()
  }
  applyTanForce(force){
    // add force in the direction of mainAngle (negative to point toward player)
    this.vel.x += (force * cos(this.mainAngle));
    this.vel.y += (force * sin(this.mainAngle));
  }
         
  }
  
  class bullet
  {
  constructor(playerOrEnemy){
    //if(playerOrEnemy = true)
    //{
      this.flightForce = 5;
      this.angle = player.mainAngle-180;
      this.pos = createVector(player.pos.x,player.pos.y);
      this.vel = createVector(0, 0);
    //}
  }
  update()
  {
    this.applyTanForce(this.flightForce);
    this.pos.add(this.vel);
  }
  display()
  {
    push()
    //translate(this.pos.x,this.pos.y);
    fill(255);
    circle(this.pos.x,this.pos.y,5);
  }
  applyTanForce(force){
    this.vel.x =(force*-cos(this.angle));
    this.vel.y =(force*-sin(this.angle));
  }
    
}
function keyPressed()
{
  if(key === "p"){
       console.log("ran");
   enemyShips.push(new Enemy());
  }
  if(key === "f"){
    console.log("Ran Bullet");
  playerBullet.push(new bullet(true));
  }
}
 
