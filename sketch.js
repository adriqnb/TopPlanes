angleMode(DEGREES);

let player;

let forceMagnitude;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(165);
  player = new Player();
}

function draw() {
  background('#0071a7');
  player.display();
  player.update();
  player.checkEdges();
}



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
    fill(this.color);
    rect(this.x, this.y, this.width, this.height);
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
