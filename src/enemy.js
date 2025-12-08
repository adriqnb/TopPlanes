/**
 * enemy.js
 *
 * Contains code related to standard enemies
 */
let spriteEnemy;
// variables for waves
let enemyCount = 3;
let enemyKills = 0;
let eSpawnTime;

class Enemy {
  constructor() {
    if (int(random(1,3)) === 1) {  
      //ship appears on left or right
      this.posY = random(0,height);

      if (int(random(1,3)) === 1)
        this.posX = 0;
      else
        this.posX = width-50;

    } else {
      //ship appears on top or bottom
      this.posX = random(0,width-50);

      if (int(random(1,3)) === 1)
        this.posY = 50;
      else
        this.posY = height;
    }

    this.pos = createVector(this.posX, this.posY);
    this.vel = createVector(.001, .001, 0);
    this.flightForce = random(0,0.008); // force of flight between 0 and 0.008
    // hitbox size
    this.rectHeight = 25;
    this.rectWidth = 25;
    this.drag = .01; // drag force
    // initial angle toward the player (use atan2 so we get direction)
    this.mainAngle = atan2(player.pos.y - this.pos.y, player.pos.x - this.pos.x);

  }

  update() {
    // recalc angle toward player each frame
    this.mainAngle = atan2(player.pos.y - this.pos.y, player.pos.x - this.pos.x);
    // apply thrust toward player, then drag, then move
    this.applyForceComp(this.flightForce);
    this.vel.x *=(1-this.drag);
    this.vel.y *=(1-this.drag);
    this.pos.add(this.vel);
  }

  display() {
    // draw the enemy
    push()
    shadow('rgba(0, 0, 0, 1)');
    translate(this.pos.x,this.pos.y);
    rotate(this.mainAngle+270);
    image(spriteEnemy, -32, -32);
    pop()
  }

  applyForceComp(force) {
    // decomposes the force in x and y directions
    this.vel.x += (force * cos(this.mainAngle));
    this.vel.y += (force * sin(this.mainAngle));
  }
  
  checkCollision() {
    // check for collisions with any player bullet
    for (let j = 0; j < playerBulletArr.length; j++) {
      if (playerBulletArr.length != 0 && isCollision(playerBulletArr[j].pos, this.pos, playerBulletArr[j].size, this.rectWidth, this.rectHeight)) {
        //remove self from the array
        enemyCopters.splice(i,1);
        i--;
        // remove the detected bullet from the array
        playerBulletArr.splice(j,1);
        j--;
        score += 10; // increase score by 10

        healthScore += 10; // increase health score for health packs
        enemyKills += 1; // increase enemy kills
            
        // handle health on kill for player
        player.health += healOnKillMod*5
        if (player.health>player.maxHealth) {
          player.health = player.maxHealth;
        }

        // audio play enemy death sound
        enemyDeathSound.play();
      }
    }
  }
}

// spawns a new enemy
function spawnEnemy() {
  enemyCopters.push(new Enemy());
}