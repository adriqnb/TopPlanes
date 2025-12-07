// Power-Up system
let powerUpChosen = false;
let choice;
let choice2;
let dialog1;
let dialog2;

let smallHealthPacks = [];
let healthScore = 0;

let powerUpScreen = false;

//power up variables
let bulletSpeedMod = 0;
let healOnKillMod = 0;
let speedMod = 0;


function randomizePowerUp() {
  choice = (int(random(0,4)));
  choice2 = (int(random(0,4)));
  while (choice === choice2) {
    choice2 = (int(random(0,4)));
  }
  powerUpChosen = true;
}

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

function powerUp(power) {
  if (power === 0) {
    bulletSpeedMod++;
  } else if (power === 1) {
    healOnKillMod++;
  } else if (power === 2) {
    player.maxHealth += 10;
  } else {
    speedMod++;
  }
}

class PowerUpDialog {
  constructor(choice) {
    this.choice = choice;
  }

  display(posX, posY) {
    push();
    shadow('rgba(0, 0, 0, 1)');
    imageMode(CENTER);
    image(dialogBox, posX, posY, 200, 133.33)
    pop();
    push();
    fill(0);
    textAlign(CENTER);
    textSize(17);
    text(drawPowerText(this.choice), posX, posY);
    pop();
  }
}