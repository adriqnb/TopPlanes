// health pack spawn location
let hpX;
let hpY;


// small health pack drops during gameplay
class SmallHealthPack {
  constructor(xpos, ypos) {
    this.pos = createVector(xpos, ypos);
    this.size = 20;
  }

  display() {
    push();
    shadow('rgba(0, 0, 0, 1)');
    fill('rgba(255, 0, 0, 1)');
    rect(this.pos.x, this.pos.y, this.size, this.size);
    shadow(0,0,0,0);
    noStroke();
    fill('rgba(255, 255, 255, 1)');
    rect(this.pos.x+7, this.pos.y+2, 5, 15);
    rect(this.pos.x+2, this.pos.y+7, 15, 5);
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


function checkHealthPackCollision(healthPos,rectPos,rectWidth,rectHeight) {
  rectX = rectPos.x;
  rectY = rectPos.y;
  rectW = rectWidth;
  rectH = rectHeight;
  hPackW = 20;
  hPackH = 20;
  hPackX = healthPos.x;
  hPackY = healthPos.y;
  if (
    rectX + rectY > hPackX && // right edge of circle > left edge of rectangle
    rectX - rectY < hPackX + hPackW && // left edge of circle < right edge of rectangle
    rectY + rectX > hPackY && // bottom edge of circle > top edge of rectangle
    rectY - rectX < hPackY + hPackH
  ) 
  {
    // top edge of health < bottom edge of rectangle
    if (hPackX + hPackW > rectX && hPackX < rectX) {
      // health hit left edge of rectangle
      return true;
    } else if (hPackX - hPackW < rectX + rectW && hPackX > rectX + rectW) {
      // health hit right edge of rectangle
      return true;
    } else if (hPackY + hPackH > rectY && hPackY < rectY) {
      // health hit top edge of rectangle
      return true;
    } else if (hPackY - hPackH < rectY + rectH && hPackY > rectY + rectH) {
      // health hit bottom edge of rectangle
      return true;
    }
  }
}