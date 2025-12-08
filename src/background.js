/**
 * background.js
 *
 * Contains variables, classes, and functions related to the drawing of our background.
 */

/**
 * Variables
 */
let bgArray = []; // array that holds columns
let bgTile; // asset tile

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

    // draw a column of tiles
    for (let j = 0; j < height; j += bgTile.height) {
      image(bgTile, this.xpos, j);
    }
    
    // if the column moves off screen, remove it from the array
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
  // if the first column in the array enters the screen, add a new one off screen
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