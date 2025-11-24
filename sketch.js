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
  createCanvas(displayWidth,displayHeight);
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
    playerBullet[i].applyTanForce(.1);
    playerBullet[i].update();
    playerBullet[i].display();
  }
for(i=0; i<enemyBullet.length; i++){
  enemyBullet[i].applyTanForce(.1);
  enemyBullet[i].update();
  enemyBullet[i].display();
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
    if(playerOrEnemy === true)
    {
      this.color = ('#ffffff');
      this.flightForce = 5;
      this.angle = player.mainAngle-180;
      this.pos = createVector(player.pos.x,player.pos.y);
      this.vel = createVector(0, 0);
    }
    else
    {
      this.color = ('#ff0000');
      this.flightForce = 5;
      this.angle = enemyShips[i].mainAngle-180;
      this.pos = createVector(enemyShips[i].pos.x,enemyShips[i].pos.y);
      this.vel = createVector(0, 0);
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
    

    circle(this.pos.x,this.pos.y,5);
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
  if(key === "f"){
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
    text("Use WASD to move, mouse to aim, F to shoot, P to spawn enemy ships", windowWidth/2, 30);
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
 
