//BE MINDFUL
//THIS DOES NOT WORK
//i think we need major changes to the physics engine
// rotation of player character is not working properly
//if you can figure it out please do
let player;
let forceMagnitude;

let enemyShips = [];

// Player class
class Player {
  constructor() {
    this.x = width / 2;
    this.y = height - 50;
    this.width = 40;
    this.height = 40;
    this.angle = 0;
    this.color = '#ffffffff';

    this.position = createVector(this.x, this.y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
  }

  display() {
    push();
    fill(this.color);
    this.rotate(this.angle);
    rect(this.x, this.y, this.width, this.height);
    pop();
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    this.x = this.position.x;
    this.y = this.position.y;
  }
  rotate(angleChange) {
    this.angle += angleChange;
    console.log(this.angle);
  }
  checkEdges() {
    if (this.x < 0) {
      this.x = 0;
      this.velocity.x = 0;
    } else if (this.x + this.width > width) {
      this.x = width - this.width;
      this.velocity.x = 0;
    }
    if (this.y < 0) {
      this.y = 0;
      this.velocity.y = 0;
    } else if (this.y + this.height > height) {
      this.y = height - this.height;
      this.velocity.y = 0;
  }}
}

function keyPressed() {
  forceMagnitude = 4.0;
  /*
  if (keyCode === 65) {         // A key rotates left
    player.applyForce(createVector(-forceMagnitude, 0));
  } else if (keyCode === 68) {  // D key rotates right
    player.applyForce(createVector(forceMagnitude, 0));
  } else if (keyCode === 87) {  // W key moves forward
    player.applyForce(createVector(0, -forceMagnitude));
  } else if (keyCode === 83) {  // S key moves backward
    player.applyForce(createVector(0, forceMagnitude));
  }*/

  // if W pressed, move ship in direction it's facing
  // if S pressed, move ship in opposite direction
  // if A pressed, rotate ship left
  // if D pressed, rotate ship right
  if (keyCode === 65) {         // A key rotates left
    player.rotate(-45);
  } else if (keyCode === 68) {  // D key rotates right
    player.rotate(45);
  } else if (keyCode === 87) {  // W key moves forward
    player.velocity.y = -forceMagnitude;
  } else if (keyCode === 83) {  // S key moves backward
    player.velocity.y = forceMagnitude;
  }

  if (keyCode === SHIFT) {  // don't work
    forceMagnitude *= 2;
  }

  if(key === "p")
    enemyShips.push(new Ship());
  console.log(enemyShips);
}

function keyReleased() {
  if (keyCode === 65 || keyCode === 68) {
    player.velocity.x = 0;
  } else if (keyCode === 87 || keyCode === 83) {
    player.velocity.y = 0;
  }

  if (keyCode === SHIFT) {  // don't work
    forceMagnitude /= 2;
  }

  
}

class Ship
{
  constructor(enemy){

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

  }

  drawShip()
  {
   fill(255);
   rect(this.posX,this.posY-50,50,50);
  }
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(165);
  angleMode(DEGREES);

  player = new Player();
}

function draw() {
  background('#0071a7');
  player.display();
  player.update();
  player.checkEdges();

  for(i=0; i<enemyShips.length; i++)
    enemyShips[i].drawShip();
}