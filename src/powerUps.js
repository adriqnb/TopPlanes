/**
 * powerUps.js
 *
 * Contains code related to the power up system
 */

let powerUpChosen = false; // has player chosen a power up
let choice; // first power up choice
let choice2; // second power up choice
// choice boxes for power up screen
let dialog1;
let dialog2;
let dialogBox; // dialog box sprite

let smallHealthPacks = []; // array to hold small health packs (should only be 1 at a time)
let healthScore = 0; // score counter for health pack spawn

let powerUpScreen = false; // is power up selection screen active

//power up modifiers
let bulletSpeedMod = 0;
let healOnKillMod = 0;
let speedMod = 0;

// randomize power up choices
function randomizePowerUp() {
  choice = (int(random(0,4)));
  choice2 = (int(random(0,4)));
  while (choice === choice2) {
    choice2 = (int(random(0,4)));
  }
  powerUpChosen = true;
}

// return power up text based on selected power
function drawPowerText(selectedPower) {
  if (selectedPower === 0)
    return ("Increase Fire Rate");
  else if (selectedPower === 1)
    return ("Increase Health On Kill");
  else if (selectedPower === 2)
    return ("Increase Max HP by 10");
  else 
    return ("Increase Speed"); 
}

// apply selected power up effects
function powerUp(power) {
  if (power === 0) {
    // fire rate increase
    bulletSpeedMod++;
  } else if (power === 1) {
    // heal on kill increase
    healOnKillMod++;
  } else if (power === 2) {
    // max health increase
    player.maxHealth += 10;
  } else {
    // player speed increase
    speedMod++;
  }
}

// class that handles the dialog box for the power up screen
class PowerUpDialog {
  constructor(choice) {
    this.choice = choice;
  }

  display(posX, posY) {
    // draw the dialog box for a power up
    push();
    shadow('rgba(0, 0, 0, 1)');
    imageMode(CENTER);
    image(dialogBox, posX, posY, 200, 133.33)
    pop();
    // draw the name up the power up
    push();
    fill(0);
    textAlign(CENTER);
    textSize(17);
    text(drawPowerText(this.choice), posX, posY);
    pop();
  }
}

function drawPowerUpScreen() {
  // if wave is over
  if (powerUpScreen) {
    // if the power up has not been chosen
    if (!powerUpChosen) {
      randomizePowerUp();
      // create the dialog boxes for power ups
      dialog1 = new PowerUpDialog(choice);
      dialog2 = new PowerUpDialog(choice2);
    }
    // display the dialog boxes for power ups  
    dialog1.display(width/3, height/2);
    dialog2.display(2*width/3, height/2);
      
  }
}