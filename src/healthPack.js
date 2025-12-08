/**
 * healthPack.js
 *
 * Contains code related to the health packs
 */

// health pack spawn location
let hpX;
let hpY;

// small health pack drops during gameplay
class SmallHealthPack {
  constructor(xpos, ypos) {
    this.pos = createVector(xpos, ypos);
    //health pack visual size
    this.size = 30;
  }

  display() {
    push();
    shadow('rgba(0, 0, 0, 1)');
    fill('rgba(255, 0, 0, 1)');
    rect(this.pos.x-15, this.pos.y-15, this.size, this.size);
    shadow(0,0,0,0);
    noStroke();
    fill('rgba(255, 255, 255, 1)');
    rect(this.pos.x-3.5, this.pos.y-10, 6, 20);
    rect(this.pos.x-11.5, this.pos.y-3, 22, 6);
    pop();
  }

  getPos() {
    return this.pos;
  }
}

// small health pack pickup
function smallHPPickup() {
  player.health += 20;

  // play health pack pickup sound
  healthPackSound.play();

  if (player.health > player.maxHealth)
    player.health = player.maxHealth;
}

function drawHP() {
  // draw health packs
  for (let h = 0; h < smallHealthPacks.length; h++) {
    smallHealthPacks[h].display();
    if (isCollision(smallHealthPacks[h].getPos(), player.pos, 12, player.rectWidth, player.rectHeight)) {
      smallHealthPacks.splice(h, 1);
      smallHPPickup();
      h--;

      healthScore = 0; // reset health score to prevent multiple spawns
    }
  }
}

function spawnHP() {
  // spawn health packs upon enemy kills at latest enemy killed's location
  if (healthScore % 50 === 0 && healthScore != 0 && smallHealthPacks.length < 1) {
    smallHealthPacks.push(new SmallHealthPack(hpX, hpY));

    hpX = enemyCopters.length > 0 ? enemyCopters[0].pos.x : random(50, width - 50);
    hpY = enemyCopters.length > 0 ? enemyCopters[0].pos.y : random(50, height - 50);
  }  
}