/**
 * background.js
 *
 * Contains variables, classes, and functions related to the drawing of our background.
 */

/**
 * Variables
 */
let bgArray = [];
let bgTile;

/**
 * Classes
 */
class BgCol {
  constructor(xpos) {
    this.xpos = xpos;
  }

  display() {
    // speed of background movement
    this.xpos += map(cos(frameCount), 0, 0.5, 0.5, 1);

    for (let j = 0; j < height; j += bgTile.height) {
      image(bgTile, this.xpos, j);
    }

    if (this.xpos >= width+bgTile.width) {
      bgArray.shift();
    }
  }

  getXpos() {
    return this.xpos;
  }
}

/**
 * Functions
 */
function drawBg() {
  // draw background columns as each column moves off screen
  for (let i = 0; i < bgArray.length; i++) {
    bgArray[i].display();
  }
  
  if (bgArray[bgArray.length - 1].getXpos() > 0) {
    bgArray.push(new BgCol(-bgTile.width+2));
  }
}

function initBg() {
  // initialize background columns
  for (let i = width; i > -bgTile.width; i -= bgTile.width) {
    bgArray.push(new BgCol(i));
  }
}