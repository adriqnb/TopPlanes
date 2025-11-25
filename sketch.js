let showText = true;

let player;
let spritePlayer, spriteEnemy;
let enemyShips = [];
let playerBullet = [];

// preload sound
let shootSound;
let bgMusic;

function preload() {
  soundFormats('mp3', 'ogg', 'wav');

  spriteEnemy = loadImage('assets/enemy.gif');
  spritePlayer = loadImage('assets/player.gif');

  shootSound = loadSound('assets/sounds/Pew.wav');
  shootSound.setVolume(0.2);

  bgMusic = loadSound('assets/sounds/menu_music_potentially.wav');
  // play background music in loop
  bgMusic.setVolume(0.05);
  bgMusic.loop();
}

let enemyBullet = [];
let bulletInterval = setInterval(runBullet, 1000)

function setup() {
  
  createCanvas(windowWidth,windowHeight);
  angleMode(DEGREES);
  player = new Player();
}

function draw() {
 background('#0071a7');

  startMenu();

  backgroundMusicPlay();
  
  player.checkMovement();
  player.update();
  player.display();
  for(i=0; i<enemyShips.length; i++){
    enemyShips[i].applyTanForce(.01);  
    enemyShips[i].update();  
    enemyShips[i].display();
  }
  for(i=0; i<playerBullet.length; i++){
    const pb = playerBullet[i];
    pb.applyTanForce(.1);
    pb.update();
    pb.display();
  
    for(j = 0; j<enemyShips.length; j++){
    if(playerBullet.length != 0 && checkCollision(pb.pos,enemyShips[j].pos,pb.size,enemyShips[j].rectWidth,enemyShips[j].rectHeight))
    {
      enemyShips.splice(j,1);
      j--;
      playerBullet.splice(i,1);
      i--;
    }
    }
  }
 for(i=0; i<enemyBullet.length; i++){
    enemyBullet[i].applyTanForce(.1);
    enemyBullet[i].update();
    enemyBullet[i].display();
    if(checkCollision(enemyBullet[i].pos,player.pos,enemyBullet[i].size,player.rectWidth,player.rectHeight)) {
      console.log("death");
      enemyBullet.splice(i,1);
      i--
      player.health -= 10;
    }
  }
// clouds on window sides
noStroke();
fill(255, 255, 255, 185);
// left side
circle(-10,0,150);
circle(-10,100,200);
circle(-10,300,150);
circle(-10,500,150);
circle(-10,600,140);
circle(-10,700,180);
circle(-10,900,120);
circle(-10,1100,160);
circle(-10,1300,200);
// right side
circle(windowWidth+10,100,200);
circle(windowWidth+10,200,150);
circle(windowWidth+10,300,150);
circle(windowWidth+10,500,180);
circle(windowWidth+10,700,220);
circle(windowWidth+10,900,160);
circle(windowWidth+10,1100,200);
// bottom side
circle(0,windowHeight+10,150);
circle(100,windowHeight+10,180);
circle(200,windowHeight+10,200);
circle(400,windowHeight+10,150);
circle(600,windowHeight+10,180);
circle(800,windowHeight+10,130);
circle(1000,windowHeight+10,170);
circle(1200,windowHeight+10,200);
circle(1400,windowHeight+10,160);
circle(1600,windowHeight+10,190);
// top side
circle(100,-10,200);
circle(200,-10,130);
circle(300,-10,150);
circle(500,-10,200);
circle(700,-10,180);
circle(900,-10,160);
circle(1100,-10,190);
circle(1300,-10,140);
circle(1500,-10,170);

fill(41,255,82)
rect(100,100,player.health,20); //health bar
}


class Player{
  constructor() {
    this.squareSize = 50;
    this.pos = createVector(100, 100);
    this.vel = createVector(0, 0, 0);
    this.rectHeight = 50;
    this.rectWidth = 50;
    this.drag = 0.1;
    this.health = 100;
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

    // constrain player to window
    this.pos.x = constrain(this.pos.x, 0, windowWidth);
    this.pos.y = constrain(this.pos.y, 0, windowHeight);
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
    this.flightForce = random(0,0.008);
    this.rectHeight = 50;
    this.rectWidth = 20;
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
    if(playerOrEnemy === true)
    {
      this.color = ('#ffffff');
      this.flightForce = 15;
      this.angle = player.mainAngle-180;
      this.pos = createVector(player.pos.x,player.pos.y);
      this.vel = createVector(0, 0);
      this.size = 5;
    }
    else
    {
      this.color = ('#ff0000');
      this.flightForce = 5;
      this.angle = enemyShips[i].mainAngle-180;
      this.pos = createVector(enemyShips[i].pos.x,enemyShips[i].pos.y);
      this.vel = createVector(0, 0);
      this.size = 5;
    }
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
    fill(this.color);
    

    circle(this.pos.x,this.pos.y,this.size);
    pop();
  }
  applyTanForce(force) {
    this.vel.x =(force*-cos(this.angle));
    this.vel.y =(force*-sin(this.angle));
  }
    
}
  
function keyPressed()
{
  showText = false;

  if(key === "p"){
    console.log("ran");
    enemyShips.push(new Enemy());
  }
  if(key === " "){
    console.log("Ran Bullet");
      playerBullet.push(new bullet(true));

    // audio play shoot sound
    if (!shootSound.isPlaying()) {
      shootSound.play();
    } 
  }
}

function startMenu()
{
  // start game text
  if (showText) {
    fill(255);
    textSize(20);
    textAlign(CENTER);
    text("Use WASD to move, mouse to aim, F to shoot, P to spawn enemy ships", windowWidth/2, 150);
    textSize(40);
    text("Press any key to start", windowWidth/2, windowHeight/2);
  }
}

function backgroundMusicPlay()
{
  if (!showText) {
    if (!bgMusic.isPlaying()) {
      bgMusic.setVolume(0.05);
      bgMusic.play();
    }
  }
}

function runBullet()
{
  for(i = 0; i<enemyShips.length; i++)
    enemyBullet.push(new bullet(false));
}

function checkCollision(bulletPos,RectPos,circleSize,rectWidth,rectHeight)
{
 circleX = bulletPos.x;
 circleY = bulletPos.y;
 rectX = RectPos.x;
 rectY = RectPos.y;
 circleR = circleSize*2;
 rectW = rectWidth;
 rectH = rectHeight;

 

if (
    circleX + circleR > rectX && // right edge of circle > left edge of rectangle
    circleX - circleR < rectX + rectW && // left edge of circle < right edge of rectangle
    circleY + circleR > rectY && // bottom edge of circle > top edge of rectangle
    circleY - circleR < rectY + rectH
  ) {
    // top edge of circle < bottom edge of rectangle
    // collision detected
    bg = color(0, 0, 255);
    if (circleX + circleR > rectX && circleX < rectX) {
      // circle hit left edge of rectangle
      return true;
    } else if (circleX - circleR < rectX + rectW && circleX > rectX + rectW) {
      // circle hit right edge of rectangle
      return true;
    } else if (circleY + circleR > rectY && circleY < rectY) {
      // circle hit top edge of rectangle
      return true;
    } else if (circleY - circleR < rectY + rectH && circleY > rectY + rectH) {
      // circle hit bottom edge of rectangle
      return true;
    }
  } else {
    // no collision
    bg = color(120, 120, 120);
    collisionSide = "";
  }
}