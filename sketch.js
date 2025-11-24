let showText = true;

let player
let enemyShips = [];
let playerBullet = [];

// preload sound
let shootSound;
let bgMusic;

function preload() {
  soundFormats('mp3', 'ogg', 'wav');

  shootSound = loadSound('assets/sounds/Pew.wav');
  shootSound.setVolume(0.2);

  bgMusic = loadSound('assets/sounds/menu_music_potentially.wav');
  // play background music in loop
  bgMusic.setVolume(0.05);
  bgMusic.loop();
}

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

}


class Player{
  constructor() {
    this.squareSize = 50;
    this.pos = createVector(100, 100);
    this.vel = createVector(0, 0, 0);
    this.flightForce = .5;
    this.rectHeight = 50;
    this.rectWidth = 50;
    this.drag = .02;
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
    rotate(this.mainAngle -180);
    rect(-this.rectHeight/2, -this.rectWidth/2, this.rectWidth,this.rectHeight);
    fill(220);
    rect(-this.rectHeight/2, -this.rectWidth/2, this.rectWidth-30,this.rectHeight);
    pop()
  }
 
  checkMovement()
  {
    //-------------WASD----------------
    if(keyIsDown(87) === true)
      this.vel.y -= .5;
    
    if(keyIsDown(65)){
      this.vel.x -= .5
    }
    else if(keyIsDown(68)){
      this.vel.x +=.5;
    }
    if(keyIsDown(83))
      this.vel.y +=.5
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
    font = loadFont('assets/fonts/PressStart2P-Regular.ttf');
    textFont(font);
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
 
