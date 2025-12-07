// health pack spawn location
let hpX;
let hpY;


// small health pack drops during gameplay
class SmallHealthPack {
  constructor(xpos, ypos) {
    this.pos = createVector(xpos, ypos);
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