/**
 * boss.js
 *
 * Contains code related to boss enemy
 */
let spriteBoss;
let bossCount = 0; // number of bosses in the stage
let bossKills = 0; // number of bosses player has killed
let bSpawnTime; // spawn time for bosses

class Boss {
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
    this.flightForce = random(0,0.01); // force of flight between 0 and 0.01
    // hitbox size
    this.rectHeight = 75;
    this.rectWidth = 75;
    this.drag = .01; // drag force
    this.health = 100;
    this.maxHealth = 100;
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
    // draw boss
    push();
    shadow('rgba(0, 0, 0, 1)');
    translate(this.pos.x,this.pos.y);
    rotate(this.mainAngle+270);
    image(spriteBoss, -64, -64);
    pop();
    // draw boss health bar
    push();
    fill(0);
    stroke(0);
    strokeWeight(3);
    rect(this.pos.x-67,this.pos.y+((this.pos.y < height-100) ? 75 : -90),134,13); //current health
    pop();
    push();
    fill('rgba(192, 0, 0, 1)');
    rect(this.pos.x-67,this.pos.y+((this.pos.y < height-100) ? 75 : -90),map(this.health,0,this.maxHealth,0,134),13); //current health
    pop();
    push();
    shadow(0);
    fill(255);
    textAlign(CENTER);
    textSize(16);
    text(this.health+'/'+this.maxHealth,this.pos.x,this.pos.y+((this.pos.y < height-100) ? 85 : -80));
    pop();
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
        // remove the detected bullet from the array
        playerBulletArr.splice(j,1);
        j--;

        this.health -= 10; // remove 10 health from boss
        healthScore += 20; // increase health score for health packs
        bossHitSound.play();

        if (this.health == 0) { // if boss health = 0
          // remove self from the array
          bossCopters.splice(i,1);
          i--;

          score += 100; // add 100 to score
          bossKills += 1; // add 1 to boss kills

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
}

// spawn a new boss
function spawnBoss() {
  bossCopters.push(new Boss());
}