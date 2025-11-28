let showText = true;
let paused = false;

let player;
let spritePlayer, spriteEnemy, spriteCrosshair, clouds, bgTile;
let enemyShips = [];
let playerBullet = [];
let bgArray = [];
let lastShotTime;
let death = false;
let score = 0;
let bgVolume = 0.25;
let bulletVolume = 0.05;

// preload sound
let shootSound;
let bgMusic;

function preload() {
  soundFormats('mp3', 'ogg', 'wav');

  spriteEnemy = loadImage('assets/enemy.gif');
  spritePlayer = loadImage('assets/player.gif');
  spriteCrosshair = loadImage('assets/crosshair.gif');
  bgTile = loadImage('assets/bgTile.png');
  pause = loadImage('assets/pause.png');

  shootSound = loadSound('assets/sounds/Pew.wav');
  shootSound.setVolume(bulletVolume);

  bgMusic = loadSound('assets/sounds/menu_music_potentially.wav');
  // play background music in loop
  bgMusic.setVolume(bgVolume);
  bgMusic.loop();
}

let enemyBullet = [];
let bulletInterval = setInterval(runBullet, 1000)

function setup() {
  createCanvas(windowWidth,windowHeight);
  angleMode(DEGREES);
  player = new Player();
  lastShotTime = millis();
}

function draw() {
  background('#0071a7');
  drawBg();
  for (let i = 0; i < bgArray.length; i++) {
    bgArray[i].draw();
  }
  noCursor();
  
  startMenu();

  backgroundMusicPlay();

  if (player.health <= 0)
    death = true;
  
  if (death === false){
    player.checkMovement();
    player.checkShooting(); //rapid fire function
    player.update();
    player.display();
    for (i=0; i<enemyShips.length; i++){
      enemyShips[i].applyTanForce(.01);  
      enemyShips[i].update();  
      enemyShips[i].display();
    } 

    for (i=0; i<playerBullet.length; i++){
      const pb = playerBullet[i];
      pb.applyTanForce(.1);
      pb.update();
      pb.display();

      for (j = 0; j<enemyShips.length; j++){
        if (playerBullet.length != 0 && checkCollision(pb.pos,enemyShips[j].pos,pb.size,enemyShips[j].rectWidth,enemyShips[j].rectHeight,pb.mainAngle))
        {
          enemyShips.splice(j,1);
          j--;
          playerBullet.splice(i,1);
          i--;
          score += 10;
        }
      }
    }
    for(i=0; i<enemyBullet.length; i++){
      enemyBullet[i].applyTanForce(.1);
      enemyBullet[i].update();
      enemyBullet[i].display();
      if(checkCollision(enemyBullet[i].pos,player.pos,enemyBullet[i].size,player.rectWidth,player.rectHeight,player.mainAngle)) {
        console.log("death");
        enemyBullet.splice(i,1);
        i--
        player.health -= 10;
      }
    }

    //draw health bar
    push();
    shadow('rgba(0, 0, 0, 1)');
    fill(0);
    rect(player.pos.x-35,player.pos.y+45,map(player.maxHealth,0,100,0,70),13); //max health
    pop();
    fill('rgba(0, 192, 35, 1)');
    rect(player.pos.x-35,player.pos.y+45,map(player.health,0,100,0,70),13); //current health
    push()
    shadow('rgba(0, 0, 0, 1)');
    fill(255);
    textAlign(CENTER);
    textSize(15);
    text(player.health+'/'+player.maxHealth,player.pos.x,player.pos.y+56.5)
    pop();
  } 
  
  if(death === true)
  {
    push();
    shadow('rgba(0, 0, 0, 1)');
    fill(255)
    textSize(40);
    textAlign(CENTER);
    text("Game Over! Press R to restart", windowWidth/2,windowHeight/2-100)
    text("score: ")
    pop();
  }
  push();
  shadow('rgba(0, 0, 0, 1)');
  image(spriteCrosshair, mouseX-25.5, mouseY-13.5);
  pop();
  spriteCrosshair.delay(5);
}


class Player {
  constructor() {
    this.squareSize = 50;
    this.pos = createVector(windowWidth/2, windowHeight/2);
    this.vel = createVector(0, 0, 0);
    this.rectHeight = 25;
    this.rectWidth = 25;
    this.drag = 0.1;
    this.health = 100;
    this.maxHealth = 100;
  }
  update() {
    this.mainAngle = atan2(mouseY - this.pos.y, mouseX - this.pos.x);
    this.vel.x *=(1-this.drag);
    this.vel.y *=(1-this.drag);
    this.pos.add(this.vel);
  }
  display() {
    push()
    shadow('rgba(0, 0, 0, 1)');
    translate(this.pos.x,this.pos.y);
    rotate(this.mainAngle -90);
    image(spritePlayer, -32, -32);
    pop()
  }
 
  checkMovement()
  {
    //-------------WASD----------------
    if (keyIsDown(87))
      this.vel.y -= .75;
    
    if (keyIsDown(65)){
      this.vel.x -= .75
    }
    else if (keyIsDown(68)){
      this.vel.x +=.75;
    }

    if (keyIsDown(83))
      this.vel.y +=.75
    //----------------------------------
    //          Afterburner

    // constrain player to window
    this.pos.x = constrain(this.pos.x, 35, windowWidth-35);
    this.pos.y = constrain(this.pos.y, 35, windowHeight-35);
  }
  
  checkShooting()
  {
    //----------------------------------
    //    Check for shooting input
    if(keyIsDown(32) && (millis() > (lastShotTime + 150))) // (lastShotTime + interval between bullets)
    {
      console.log("Ran Bullet");
      playerBullet.push(new Bullet(true));

      spriteCrosshair.reset();

      // audio play shoot sound
      shootSound.play();

      lastShotTime = millis();
    }
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
    this.rectHeight = 25;
    this.rectWidth = 25;
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
    shadow('rgba(0, 0, 0, 1)');
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
  
  class Bullet
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
    shadow('rgba(0, 0, 0, 1)');
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
  if((key === "r" || key === "R") && death === true)
  {
    resetGame();
    death = false;
  }
  if(key === "p" || key === "P")
  {
    console.log("ran");
    enemyShips.push(new Enemy());
  }
  if(keyCode === ESCAPE)
  {
    if (!paused) {
      frameRate(0);
      image(pause, windowWidth/2-256, windowHeight/2-256);
      fill('rgba(0, 0, 0, 0.5)');
      rect(0, 0, windowWidth, windowHeight);
    } else {
      frameRate(60);
    }
    paused = !paused;
  }


  if(keyCode === 112){
    spriteEnemy = loadImage('libraries/enemy.png');
  }
}

function startMenu()
{
  // start game text
  if (showText) {
    push();
    shadow('rgba(0, 0, 0, 1)');
    fill(255);
    textSize(20);
    textAlign(CENTER);
    text("Use WASD to move, mouse to aim, Space to shoot, P to spawn enemy ships", windowWidth/2, 150);
    textSize(40);
    text("Press any key to start", windowWidth/2, windowHeight/2);
    pop();
  }
}

function backgroundMusicPlay()
{
  if (!showText) {
    if (!bgMusic.isPlaying()) {
      bgMusic.setVolume(bgVolume);
      bgMusic.play();
    }
  }
}

function runBullet()
{
  for(i = 0; i<enemyShips.length; i++)
    enemyBullet.push(new Bullet(false));
}

function checkCollision(bulletPos,rectPos,circleSize,rectWidth,rectHeight,angle)
{
  circleX = bulletPos.x;
  circleY = bulletPos.y;
  rectX = rectPos.x;
  rectY = rectPos.y;
  circleR = circleSize*2;
  rectW = rectWidth;
  rectH = rectHeight;

  if (
    circleX + circleR > rectX && // right edge of circle > left edge of rectangle
    circleX - circleR < rectX + rectW && // left edge of circle < right edge of rectangle
    circleY + circleR > rectY && // bottom edge of circle > top edge of rectangle
    circleY - circleR < rectY + rectH
  )
  {
    // top edge of circle < bottom edge of rectangle
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
    collisionSide = "";
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

//evil overcomplicated bg class and function
class TiledBg {
  constructor(initX) {
    this.timer = 0;
    this.initX = initX;
  }

  draw() {
    this.timer += 10;
    push();
    translate(this.timer, 0);
    for (let x = this.initX; x < (windowWidth + this.initX); x += bgTile.width) {
      for (let y = 0; y < windowHeight; y += bgTile.height) { 
        image(bgTile, x, y);
      }
    }
    pop();
  }

  getTimer() {
    return this.timer;
  }

  resetTimer() {
    this.timer = 0;
  }

}

function drawBg() {
  if (bgArray.length < 2) {
    bgArray.push(new TiledBg(0));
    bgArray.push(new TiledBg(-windowWidth+95));
  }
  if(bgArray[0].getTimer() > windowWidth-95) {
    bgArray[0].resetTimer();
  }
  if (bgArray[1].getTimer() > windowWidth-95) {
    bgArray[1].resetTimer();  
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function resetGame()
{
  player.maxHealth = 100;
  player.health = 100;
  score = 0;
  player.pos.x = windowWidth/2;
  player.pos.y = windowHeight/2+100;
  enemyShips = [];
  playerBullet = [];
  enemyBullet = [];
}

function shadow(color, blurRadius = 10, offsetX = 0, offsetY = 0) {
    drawingContext.shadowColor = color;
    drawingContext.shadowBlur = blurRadius;
    drawingContext.shadowOffsetX = offsetX;
    drawingContext.shadowOffsetY = offsetY;
}

function noShadow() {
    drawingContext.shadowColor = '#0000';
}