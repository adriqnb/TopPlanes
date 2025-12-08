// Global variables
let showText = true;
let showReminder = false;
let paused = false;

// Game state variables
let player;
let spritePlayer, spriteEnemy, spriteCrosshair, dialogBox;
let pixelFont;

// Background variables
let death = false;
let score = 0;
let playerBulletArr = [];
let enemyBulletArr = [];
let bossBulletArr = [];
let enemyCopters = [];
let bossCopters = [];

let bulletInterval = setInterval(runBullet, 1000);  // Bullet firing rpm

// Set audio volume
let bgVolume = 0.12; // Background music
let bulletVolume = 0.05; // Bullet sfx
let sfxVolume = 0.15; // All other sfx

// preload sound
let shootSound;
let playerDamageSound;
let playerDeathSound;
let enemyDeathSound;
let healthPackSound;
let bossHitSound;
let bgMusic;

function preload() {
  // Preload the pixel font
  pixelFont = loadFont('assets/BoldPixels.ttf');

  // Preload game assets
  spriteEnemy = loadImage('assets/enemy.gif');
  spriteBoss = loadImage('assets/boss.gif');
  spritePlayer = loadImage('assets/player.gif');
  spriteCrosshair = loadImage('assets/crosshair.gif');
  bgTile = loadImage('assets/bgTile.png');
  pause = loadImage('assets/pause.png');
  dialogBox = loadImage('assets/dialogbox.png')
  logo = loadImage('assets/logo.gif')

  loadAudio();
}

function setup() {
  createCanvas(windowWidth,windowHeight); // Creates a canvas the size of the current window
  angleMode(DEGREES); // Set all angles to be in degrees
  player = new Player(); // Create the player
  textFont(pixelFont); // Sets the font
  initBg(); // Initialize background columns
}

function draw() {
  drawBg(); // Draw background columns
  noCursor(); // Hide cursor
  
  startMenu();  // Display start menu

  backgroundMusicPlay();  // Play background music

  // check for player death
  if (player.health <= 0)
    death = true;

  // Main game loop
  if (!death) {
    // variables for health pack spawn location
    hpX = enemyCopters.length > 0 ? enemyCopters[0].pos.x : random(50, width - 50);
    hpY = enemyCopters.length > 0 ? enemyCopters[0].pos.y : random(50, height - 50);

    // update and display player
    player.checkMovement();
    player.checkShooting(); //rapid fire function
    player.checkCollision();
    player.update();
    player.display();

    // update and display enemies, bosses, and bullets
    copterArrUpdate(enemyCopters);
    copterArrUpdate(bossCopters);
    bulletArrUpdate(playerBulletArr);
    bulletArrUpdate(enemyBulletArr);
    bulletArrUpdate(bossBulletArr);
  
    //draw FPS counter
    push();
    textSize(15);
    text(`${Math.trunc(frameRate())}`, 20, 30);
    pop();

    drawHealthBar();  // draw player health bar

    // spawn health packs upon enemy kills at latest enemy killed's location
    if (healthScore % 50 === 0 && healthScore != 0 && smallHealthPacks.length < 1) {
      smallHealthPacks.push(new SmallHealthPack(hpX, hpY)); // push new health pack to array

      // reset health pack spawn location
      hpX = enemyCopters.length > 0 ? enemyCopters[0].pos.x : random(50, width - 50);
      hpY = enemyCopters.length > 0 ? enemyCopters[0].pos.y : random(50, height - 50);
    }

    // draw health packs
    for (let h = 0; h < smallHealthPacks.length; h++) {
      smallHealthPacks[h].display();  // display health pack

      // check for collision with player
      if (isCollision(smallHealthPacks[h].getPos(), player.pos, 12, player.rectWidth, player.rectHeight)) {
        smallHealthPacks.splice(h, 1);  // remove health pack from array
        smallHPPickup();  // apply health pack effect
        h--;

        healthScore = 0; // reset health score to prevent multiple spawns
      }
    }

    // display current wave
    push();
    fill(255);
    textSize(40);
    shadow('rgba(0, 0, 0, 1)');
    text("Wave " + wave, width/20, height/10);
    pop();

    // wave management
    if (start) {
      startWave();
      // spawn enemies
      if ((millis() > (eSpawnTime + 1000-(wave*10))) && ((enemyCount-enemyKills) > (enemyCopters.length))) {
        spawnEnemy();
        eSpawnTime = millis();
      }

      // spawn bosses
      if ((millis() > (bSpawnTime + 1000-(wave*10))) && ((bossCount-bossKills) > (bossCopters.length)) && ((wave % 5) == 0)) {
        spawnBoss();
        bSpawnTime = millis();
      }

      // check for end of wave
      if (((wave % 5) == 0)) {
        if (enemyCount <= enemyKills && bossCount <= bossKills) {
          wave++;
          endWave();
        }
      } else {
        // regular waves check
        if (enemyCount <= enemyKills) {
          wave++;
          endWave();
        }
      }
    }
    
    // power up screen
    if (powerUpScreen) {
      // if power up not yet chosen, randomize choices and create choice boxes
      if (!powerUpChosen) {
        randomizePowerUp();
        dialog1 = new PowerUpDialog(choice);
        dialog2 = new PowerUpDialog(choice2);
      }
      
      dialog1.display(width/3, height/2);
      dialog2.display(2*width/3, height/2);
      
    }
  } 
  
  // Game over screen
  if (death) {
    // play player death sound
    playerDeathSound.play();
    noLoop();

    bgMusic.stop(); // stop background music
    spriteCrosshair = loadImage();  // remove crosshair image
    cursor(ARROW);  // show cursor
    
    push();
    shadow('rgba(0, 0, 0, 1)');
    fill(255);
    textSize(40);
    textAlign(CENTER);
    text(`Game Over! Press R to restart\nWave: ${wave}\nScore: ${score}`, width/2, height/2-100);
    pop();
  }

  //draw crosshair
  push();
  shadow('rgba(0, 0, 0, 1)');
  image(spriteCrosshair, mouseX-25.5, mouseY-13.5);
  pop();
  spriteCrosshair.delay(5);
}

// Handle key presses
function keyPressed() {
  // Start game on any key press except ESCAPE and F1
  if (keyCode !== ESCAPE && keyCode !== 112 && showText) {
    showText = false;
    showReminder = true;
  }
  // Restart game on 'R' key press if dead
  if ((key === "r" || key === "R") && death === true) {
    resetGame();
  }
  // Pause/unpause game on ESCAPE key press
  if (keyCode === ESCAPE) {
    pauseGame();
  }
  // Spawn health pack on 'Y' key press (debugging)
  if (key === "y" || key === "Y") {
    smallHealthPacks.push(new SmallHealthPack(hpX, hpY));
  }
  // Start wave on ENTER/RETURN key press
  if (keyCode === ENTER && !powerUpScreen) {
    start = true;
    showReminder = false;
  }
  // Load enemy sprite on F1 key press (debugging)
  if (keyCode === 112) {
    spriteEnemy = loadImage('libraries/enemy.png');
    logo = loadImage('libraries/enemy.png');
  }
}

// Display start menu
function startMenu() {
  let logoPosX = width/2-80;
  let logoPosY = 300*(height/1080);

  // start game text
  if (showText) {
    push();
    shadow('rgba(0, 0, 0, 1)');
    fill(255);
    textSize(20);
    textAlign(CENTER);
    text("Use [W][A][S][D] to move, mouse to aim,\n[Space] to shoot, [Enter]/[Return] to start wave.", width/2, 120*(height/1080));
    textSize(40);
    text("Press any key to start", width/2, height-200*(height/1080));
    pop();
    push();
    textSize(80);
    shadow('rgba(0, 0, 0, 1)');
    fill('rgba(0, 192, 35, 1)');
    text("TOP", logoPosX, logoPosY);
    pop();
    push();
    shadow('rgba(0, 0, 0, 1)');
    fill('rgba(224, 44, 158, 1)');
    textSize(80);
    imageMode(CENTER);
    textAlign(LEFT);
    image(logo, logoPosX-64, logoPosY+10)
    text("COPTER", logoPosX, logoPosY+50);
    pop();
  }

  // reminder to start wave
  if(showReminder) {
    push();
    shadow('rgba(0, 0, 0, 1)');
    fill(255);
    textSize(20);
    textAlign(CENTER);
    text("[Enter]/[Return] to start wave.", width/2, 120*(height/1080));
    textSize(40);
    pop();
  }
}

// Play background music if not in text display mode
function backgroundMusicPlay() {
  if (!showText) {
    // play background music if not already playing
    if (!bgMusic.isPlaying()) {
      bgMusic.setVolume(bgVolume);
      bgMusic.play();
    }
  }
}

// Handle window resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  // reinitialize/redraw background columns on window resize
  initBg(); 
  draw();
  dialog1.display();
  dialog2.display();
  
  // ensure the game stays paused on resize
  /**
   * small bug - when actively resizing the game continues
   * to run, meaning enemies can attack you and you can die
   * if you just keep resizing
   */
  paused = false;
  pauseGame();
}

// Pause and unpause the game
function pauseGame() {
  if (!paused && !showText && !death) {
    frameRate(0); // freeze the game
    bgMusic.pause(); // pause background music
    
    // display pause overlay
    push();
    imageMode(CENTER);
    image(pause, width/2, height/2, height/4, height/4);
    pop();
    fill('rgba(0, 0, 0, 0.5)');
    rect(0, 0, width, height);

    cursor(ARROW); //show cursor

  } else if (paused && !showText && !death) {
    frameRate(60); // resume the game
    bgMusic.play(); // resume background music
    noCursor(); // hide cursor
  }
  paused = !paused;
}

// Reset the game
function resetGame() {
  window.location.reload(); // goofy way to reset the game, but idc it works
  /*
  player.maxHealth = 100;
  player.health = 100;
  score = 0;
  player.pos.x = width/2;
  player.pos.y = height/2+100;
  enemyCopters = [];
  playerBulletArr = [];
  enemyBulletArr = [];
  wave = 1;
  enemyCount = 3;
  enemyKills = 0;*/
}

// Set shadow properties for drawing context
function shadow(color, blurRadius = 10, offsetX = 0, offsetY = 0) {
  drawingContext.shadowColor = color;
  drawingContext.shadowBlur = blurRadius;
  drawingContext.shadowOffsetX = offsetX;
  drawingContext.shadowOffsetY = offsetY;
}

// Handle mouse presses
function mousePressed() { 
  if (powerUpScreen) {   
    //power up 1
    if (mouseX > (width/3)-100 && mouseX < (width/3)+100 && mouseY > (height/2)-(133.33/2) && mouseY < (height/2)+(133.33/2)) {
      powerUp(choice);
      powerUpScreen = false;
    }
    //power up 2
    if (mouseX > (2*width/3)-100 && mouseX < (2*width/3)+100 && mouseY > (height/2)-(133.33/2) && mouseY < (height/2)+(133.33/2)) {
      powerUp(choice2);
      powerUpScreen = false;
    }
    showReminder = true;
  }
}

function drawHealthBar() {
  //draw health bar
  push();
  fill(0);
  strokeWeight(2);
  stroke(0);
  rect(player.pos.x-35,player.pos.y+((player.pos.y < height-60) ? 40 : -52),70,13); //current health
  pop();
  push();
  fill('rgba(0, 192, 35, 1)');
  rect(player.pos.x-35,player.pos.y+((player.pos.y < height-60) ? 40 : -52),map(player.health,0,player.maxHealth,0,70),13); //current health
  pop();
  push();
  shadow('rgba(0, 0, 0, 1)');
  fill(255);
  textAlign(CENTER);
  textSize(16);
  text(player.health+'/'+player.maxHealth,player.pos.x,player.pos.y+((player.pos.y < height-60) ? 50.5 : -41.5));
  pop();
}

function loadAudio() {

  // Preload sound effects
  soundFormats('mp3', 'ogg', 'wav');
  // Preload shooting sound
  shootSound = loadSound('assets/sounds/Pew.wav');
  shootSound.setVolume(bulletVolume);
  // Damage sound
  playerDamageSound = loadSound('assets/sounds/player_damage.wav');
  playerDamageSound.setVolume(sfxVolume);
  // Health pack pickup sound
  healthPackSound = loadSound('assets/sounds/health_pickup.wav');
  healthPackSound.setVolume(sfxVolume);
  // Player death sounds
  playerDeathSound = loadSound('assets/sounds/player_death.wav');
  playerDeathSound.setVolume(sfxVolume);
  // Enemy death sound
  enemyDeathSound = loadSound('assets/sounds/enemy_death.wav');
  enemyDeathSound.setVolume(sfxVolume);
  // Boss hit sound
  bossHitSound = loadSound('assets/sounds/boss_hit.mp3');
  bossHitSound.setVolume(sfxVolume);

  // Preload background music 
  bgMusic = loadSound('assets/sounds/bg_music.wav');

  // Play background music in loop
  bgMusic.setVolume(bgVolume);
  bgMusic.loop();
}

// Update and display all copters in the given array
function copterArrUpdate(arr) {
  // Iterate through the array of copters
  if (arr.length > 0) {
    // Update, display, and check collision for each copter
    for (i = 0; i < arr.length; i++) { 
      const object = arr[i];
      object.update();  
      object.display();
      object.checkCollision();
    }
  }
}

// Update and display all bullets in the given array
function bulletArrUpdate(arr) {
  // Iterate through the array of bullets
  if (arr.length > 0) {
    // Update and display each bullet
    for (i = 0; i < arr.length; i++) { 
      const object = arr[i];
      object.update();  
      object.display();
    }
  }
}