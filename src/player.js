/**
 * player.js
 *
 * Contains code related to the player
 */
let player; // player object
let spritePlayer; // player sprite
let lastShotTime = 0;

class Player {
  constructor() {
    this.pos = createVector(width/2, height/2+100);
    this.vel = createVector(0, 0, 0);
    this.rectHeight = 25; // hitbox height
    this.rectWidth = 25; // hitbox width
    this.drag = 0.1; // drag factor
    this.health = 100;
    this.maxHealth = 100;
  }
  update() {
    this.mainAngle = atan2(mouseY - this.pos.y, mouseX - this.pos.x); // angle toward mouse
    this.vel.x *=(1-this.drag); // apply drag to velocity
    this.vel.y *=(1-this.drag);
    this.pos.add(this.vel); // update position by velocity
  }
  display() { // draw player
    push();
    shadow('rgba(0, 0, 0, 1)');
    translate(this.pos.x,this.pos.y);
    rotate(this.mainAngle -90);
    image(spritePlayer, -32, -32);
    pop();
  }
 
  checkMovement() { // WASD movement
    //-------------WASD----------------
    if (keyIsDown(87)) // W
      this.vel.y -= .75+(speedMod/7);
    
    if (keyIsDown(65)) { // A 
      this.vel.x -= .75+(speedMod/7);
    } else if (keyIsDown(68)) { // S
      this.vel.x +=.75+(speedMod/7);
    }

    if (keyIsDown(83)) // D
      this.vel.y +=.75+(speedMod/7);
    //----------------------------------
    //          Afterburner

    // constrain player to window
    this.pos.x = constrain(this.pos.x, 35, width-35);
    this.pos.y = constrain(this.pos.y, 35, height-35);
  }
  
  checkShooting() {
    //----------------------------------
    //    Check for shooting input
    if (keyIsDown(32) && (millis() > (lastShotTime + (1000 - bulletSpeedMod*50)))) { // (lastShotTime + interval between bullets) s
      playerBulletArr.push(new Bullet(1));

      spriteCrosshair.reset();

      // audio play shoot sound
      shootSound.play();

      lastShotTime = millis();
    }
  }

  checkCollision() {
    // check for collisions with any enemy bullets
    for (let i = 0; i < enemyBulletArr.length; i++) {
      if (enemyBulletArr.length != 0 && isCollision(enemyBulletArr[i].pos, this.pos, enemyBulletArr[i].size, this.rectWidth, this.rectHeight)) {
        // remove detected bullet from array
        enemyBulletArr.splice(i,1);
        i--;
        player.health -= 10; // subtract player health

        // audio play player damage sound
        playerDamageSound.play();
      }
    }
    
    // check for collisions with any boss bullets
    for (let i = 0; i < bossBulletArr.length; i++) {
      if (bossBulletArr.length != 0 && isCollision(bossBulletArr[i].pos, this.pos, bossBulletArr[i].size, this.rectWidth, this.rectHeight)) {
        // remove detected bullet from array
        bossBulletArr.splice(i,1);
        i--;
        player.health -= 20; // subtract player health

        // audio play player damage sound
        playerDamageSound.play();
      }
    }

  }
}