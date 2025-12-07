let showText = true;
let showReminder = false;
let paused = false;

let player;
let spritePlayer, spriteEnemy, spriteCrosshair, dialogBox;
let pixelFont;


let death = false;
let score = 0;
let playerBulletArr = [];
let enemyBulletArr = [];
let bossBulletArr = [];
let enemyCopters = [];
let bossCopters = [];

let bulletInterval = setInterval(runBullet, 1000);

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
  drawBg();
  noCursor();
  
  startMenu();

  backgroundMusicPlay();

  if (player.health <= 0)
    death = true;

  if (!death) {
    hpX = enemyCopters.length > 0 ? enemyCopters[0].pos.x : random(50, width - 50);
    hpY = enemyCopters.length > 0 ? enemyCopters[0].pos.y : random(50, height - 50);

    player.checkMovement();
    player.checkShooting(); //rapid fire function
    player.checkCollision();
    player.update();
    player.display();

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

    drawHealthBar();

    // spawn health packs upon enemy kills at latest enemy killed's location
    if (healthScore % 50 === 0 && healthScore != 0 && smallHealthPacks.length < 1) {
      smallHealthPacks.push(new SmallHealthPack(hpX, hpY));

      hpX = enemyCopters.length > 0 ? enemyCopters[0].pos.x : random(50, width - 50);
      hpY = enemyCopters.length > 0 ? enemyCopters[0].pos.y : random(50, height - 50);
    }

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

    push();
    fill(255);
    textSize(40);
    shadow('rgba(0, 0, 0, 1)');
    text("Wave " + wave, width/20, height/10);
    pop();

    if (start) {
      startWave();
      if ((millis() > (eSpawnTime + 1000-(wave*10))) && ((enemyCount-enemyKills) > (enemyCopters.length))) {
        spawnEnemy();
        eSpawnTime = millis();
      }

      if ((millis() > (bSpawnTime + 1000-(wave*10))) && ((bossCount-bossKills) > (bossCopters.length)) && ((wave % 5) == 0)) {
        spawnBoss();
        bSpawnTime = millis();
      }

      if (((wave % 5) == 0)) {
        if (enemyCount <= enemyKills && bossCount <= bossKills) {
          wave++;
          endWave();
        }
      } else {
        if (enemyCount <= enemyKills) {
          wave++;
          endWave();
        }
      }
    }
    
    if (powerUpScreen) {
      if (!powerUpChosen) {
        randomizePowerUp();
        dialog1 = new PowerUpDialog(choice);
        dialog2 = new PowerUpDialog(choice2);
      }
      
      dialog1.display(width/3, height/2);
      dialog2.display(2*width/3, height/2);
      
    }
  } 
  
  if (death) {
    // play player death sound
    playerDeathSound.play();
    noLoop();

    bgMusic.stop();
    spriteCrosshair = loadImage();
    cursor(ARROW);
    
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

function keyPressed() {
  if (keyCode !== ESCAPE && keyCode !== 112 && showText) {
    showText = false;
    showReminder = true;
  }
  if ((key === "r" || key === "R") && death === true) {
    resetGame();
  }
  if (keyCode === ESCAPE) {
    pauseGame();
  }
  if (key === "y" || key === "Y") {
    smallHealthPacks.push(new SmallHealthPack(hpX, hpY));
  }
  if (keyCode === ENTER && !powerUpScreen) {
    start = true;
    showReminder = false;
  }
  if (keyCode === 112) {
    spriteEnemy = loadImage('libraries/enemy.png');
    logo = loadImage('libraries/enemy.png');
  }
}

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

function backgroundMusicPlay() {
  if (!showText) {
    if (!bgMusic.isPlaying()) {
      bgMusic.setVolume(bgVolume);
      bgMusic.play();
    }
  }
}

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

function resetGame() {
  window.location.reload();
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

function shadow(color, blurRadius = 10, offsetX = 0, offsetY = 0) {
  drawingContext.shadowColor = color;
  drawingContext.shadowBlur = blurRadius;
  drawingContext.shadowOffsetX = offsetX;
  drawingContext.shadowOffsetY = offsetY;
}

function mousePressed() { 
  if (powerUpScreen) {   
    //power up 1

    if (mouseX > (width/3)-100 && mouseX < (width/3)+100 && mouseY > (height/2)-(133.33/2) && mouseY < (height/2)+(133.33/2)) {
      powerUp(choice);
      powerUpScreen = false;
    }

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

  shootSound = loadSound('assets/sounds/Pew.wav');
  shootSound.setVolume(bulletVolume);

  playerDamageSound = loadSound('assets/sounds/player_damage.wav');
  playerDamageSound.setVolume(sfxVolume);

  healthPackSound = loadSound('assets/sounds/health_pickup.wav');
  healthPackSound.setVolume(sfxVolume);

  playerDeathSound = loadSound('assets/sounds/player_death.wav');
  playerDeathSound.setVolume(sfxVolume);

  enemyDeathSound = loadSound('assets/sounds/enemy_death.wav');
  enemyDeathSound.setVolume(sfxVolume);

  bossHitSound = loadSound('assets/sounds/boss_hit.mp3');
  bossHitSound.setVolume(sfxVolume);

  // Preload background music 
  bgMusic = loadSound('assets/sounds/bg_music.wav');

  // Play background music in loop
  bgMusic.setVolume(bgVolume);
  bgMusic.loop();
}

function copterArrUpdate(arr) {
  if (arr.length > 0) {
    for (i = 0; i < arr.length; i++) { 
      const object = arr[i];
      object.update();  
      object.display();
      object.checkCollision();
    }
  }
}

function bulletArrUpdate(arr) {
  if (arr.length > 0) {
    for (i = 0; i < arr.length; i++) { 
      const object = arr[i];
      object.update();  
      object.display();
    }
  }
}