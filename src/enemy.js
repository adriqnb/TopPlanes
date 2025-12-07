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

  applyTanForce(force) {
    // add force in the direction of mainAngle (negative to point toward player)
    this.vel.x += (force * cos(this.mainAngle));
    this.vel.y += (force * sin(this.mainAngle));
  }
  
  checkCollision() {
    for (let j = 0; j < playerBulletArr.length; j++) {
      if (playerBulletArr.length != 0 && isCollision(playerBulletArr[j].pos, this.pos, playerBulletArr[j].size, this.rectWidth, this.rectHeight)) {
        enemyCopters.splice(i,1);
        playerBulletArr.splice(j,1);
        j--;
        score += 10;

        healthScore += 10;
        enemyKills += 1;
            
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

function spawnEnemy() {
  enemyCopters.push(new Enemy());
}