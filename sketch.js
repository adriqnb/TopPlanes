let showText = true;
let paused = false;

// game variables
let player;
let spritePlayer, spriteEnemy, spriteCrosshair, clouds, bgTile;
let enemyShips = [];
let playerBullet = [];
let lastShotTime;
let death = false;
let score = 0;
let wave = 1;
// sound variables
let bgVolume = 0.12;
let bulletVolume = 0.05;
let sfxVolume = 0.15;
// background variables
let bgArray = [];
let spawnTimeCooldownModifier = 0;
let powerUpChosen = false;  // has player chosen a power up
let choice;                 // first power up choice
let choice2;                // second power up choice

let smallHealthPacks = [];  // array to hold small health packs (should only be 1 at a time)
let healthScore = 0;        // score counter for health pack spawn
let enemyCount = 3;         // enemies to spawn per wave
let start = false;          // check wave start
let enemyKills = 0;         // enemies killed this wave
let spawnTime;              // time last enemy spawned
let started = false;        // has the wave started
let powerUpScreen = false;  // is power up selection screen active

// preload sound
let shootSound;
let playerDamageSound;
let playerDeathSound;
let enemyDeathSound;
let healthPackSound;
let bgMusic;
//power up variables
let bulletSpeedMod = 0;
let healOnKillMod = 0;
let speedMod = 0;

// health pack spawn location
let hpX;
let hpY;

function preload() 
{
  soundFormats('mp3', 'ogg', 'wav');

  spriteEnemy = loadImage('assets/enemy.gif');                        // enemy sprite
  spritePlayer = loadImage('assets/player.gif');                      // player sprite
  spriteCrosshair = loadImage('assets/crosshair.gif');                // crosshair sprite
  bgTile = loadImage('assets/bgTile.png');                            // background tile image
  pause = loadImage('assets/pause.png');                              // pause image

  // Load Sounds
  // shoot sound
  shootSound = loadSound('assets/sounds/Pew.wav');
  shootSound.setVolume(bulletVolume);
  // player damage sound
  playerDamageSound = loadSound('assets/sounds/player_damage.wav');
  playerDamageSound.setVolume(sfxVolume);
  // health pack pickup sound
  healthPackSound = loadSound('assets/sounds/health_pickup.wav');
  healthPackSound.setVolume(sfxVolume);
  // player + enemy death sound
  playerDeathSound = loadSound('assets/sounds/player_death.wav');
  playerDeathSound.setVolume(sfxVolume);
  enemyDeathSound = loadSound('assets/sounds/enemy_death.wav');
  enemyDeathSound.setVolume(sfxVolume);
  // background music
  bgMusic = loadSound('assets/sounds/menu_music_potentially.wav');
  // play background music in loop
  bgMusic.setVolume(bgVolume);
  bgMusic.loop();
}

let enemyBullet = [];                                 // array to hold enemy bullets
let bulletInterval = setInterval(runBullet, 1000);    // enemy shooting rpm

function setup() 
{
  createCanvas(windowWidth,windowHeight);
  angleMode(DEGREES);
  player = new Player();
  lastShotTime = millis();
  
  initBg(); // initialize background columns
}

function draw() 
{
  background('rgba(0, 118, 122, 1)'); // clear background
  drawBg(); // draw moving background
  noCursor(); //hide cursor
  
  startMenu();  // display start menu text

  backgroundMusicPlay();  // play background music

  // check for player death
  if (player.health <= 0)
    death = true; // set death flag, game over

  if (death === false)
  {
    // set health pack spawn location to latest enemy killed's location
    hpX = enemyShips.length > 0 ? enemyShips[0].pos.x : random(50, width - 50); 
    hpY = enemyShips.length > 0 ? enemyShips[0].pos.y : random(50, height - 50);
    // update and draw player
    player.checkMovement(); // WASD movement function
    player.checkShooting(); // rapid fire function
    player.update();        // update player position
    player.display();       // draw player
    // update and draw enemies
    for (i = 0; i < enemyShips.length; i++)
    {
      enemyShips[i].applyTanForce(.01);  // enemy move toward player
      enemyShips[i].update();            // update enemy position
      enemyShips[i].display();           // draw enemy
    } 
    // update and draw player bullets
    for (i = 0; i < playerBullet.length; i++)
    {
      const pb = playerBullet[i];       // current player bullet
      pb.applyTanForce(.1);             // move bullet
      pb.update();                      // update bullet position
      pb.display();                     // draw bullet
      // check collision with enemies
      for (j = 0; j < enemyShips.length; j++)
      {
        // check collision between player bullet and enemy ship
        if (playerBullet.length != 0 && checkCollision(pb.pos,enemyShips[j].pos,pb.size,enemyShips[j].rectWidth,enemyShips[j].rectHeight,pb.mainAngle))
        {
          enemyShips.splice(j,1); // remove enemy ship
          j--;
          playerBullet.splice(i,1); // remove player bullet
          i--;
          score += 10;         // increase score

          healthScore += 10;  // increase health pack spawn score
          enemyKills += 1;    // increase enemy kills this wave
            
          player.health += healOnKillMod*5; // heal player on kill based on mod
          // cap player health to max health
          if(player.health>player.maxHealth)
          {
            player.health = player.maxHealth;
          }
          // audio play enemy death sound
          enemyDeathSound.play();
        }
      }
    }
    // update and draw enemy bullets
    for(i = 0; i < enemyBullet.length; i++)
    {
      const eb = enemyBullet[i];     // current enemy bullet
      eb.applyTanForce(.1);          // move bullet
      eb.update();                   // update bullet position
      eb.display();                  // draw bullet
      // check collision with player
      if(checkCollision(eb.pos,player.pos,eb.size,player.rectWidth,player.rectHeight,player.mainAngle)) 
      {
        enemyBullet.splice(i,1);   // remove enemy bullet
        i--;
        player.health -= 10;      // decrease player health

        // audio play player damage sound
        playerDamageSound.play();
      }
    }
    //draw FPS counter
    push();
    text(`${Math.trunc(frameRate())}`, 20, 30);
    pop();

    //draw health bar
    push();
    shadow('rgba(0, 0, 0, 1)');
    fill(0);
    rect(player.pos.x-35,player.pos.y+((player.pos.y < height-60) ? 40 : -50), map(player.maxHealth,0,player.maxHealth,0,70),13); //max health
    pop();
    push();
    fill('rgba(0, 192, 35, 1)');
    rect(player.pos.x-35,player.pos.y+((player.pos.y < height-60) ? 40 : -50),map(player.health,0,player.maxHealth,0,70),13); //current health
    pop();
    push();
    shadow('rgba(0, 0, 0, 1)');
    fill(255);
    textAlign(CENTER);
    textSize(15);
    text(player.health+'/'+player.maxHealth,player.pos.x,player.pos.y+((player.pos.y < height-60) ? 52 : -38));
    pop();

    // spawn health packs upon enemy kills at latest enemy killed's location
    if (healthScore % 50 === 0 && healthScore != 0 && smallHealthPacks.length < 1) 
    {
      smallHealthPacks.push(new SmallHealthPack(hpX, hpY)); // push new health pack to array
      // set next spawn location
      hpX = enemyShips.length > 0 ? enemyShips[0].pos.x : random(50, width - 50); 
      hpY = enemyShips.length > 0 ? enemyShips[0].pos.y : random(50, height - 50);
    }

    // draw health packs
    for (let h = 0; h < smallHealthPacks.length; h++) 
    {
      smallHealthPacks[h].display();  // draw health pack
      // check for player collision with health pack
      if (checkHealthPackCollision(smallHealthPacks[h].getPos(), player.pos, player.rectWidth, player.rectHeight, player.mainAngle)) 
      {
        smallHealthPacks.splice(h, 1);  // remove health pack from array
        smallHPPickup();                // apply health pack pickup effects
        h--;

        healthScore = 0; // reset health score to prevent multiple spawns
      }
    }
    /*
    // remove health pack after short duration
    if (smallHealthPacks.length > 0) 
    {
      setTimeout(() => {
        smallHealthPacks.shift();
      }, 10000); // remove after 10 seconds
    }*/
    // draw score and wave number
    push();
    fill(255);
    textSize(30);
    shadow('rgba(0, 0, 0, 1)');
    text("Wave " + wave, windowWidth/20, windowHeight/10);
    pop();
  
    // wave spawning system
    if(start === true)
    {
      startWave();  // start the wave

      // spawn enemies based on time and enemies left to spawn
      if((millis() > (spawnTime + 1000-(wave*10))) && ((enemyCount-enemyKills) > (enemyShips.length))){
        spawnEnemy();
        spawnTime = millis();
      }

      // check for end of wave
      if(enemyCount <= enemyKills)
      {
        wave++;
        endWave();
      }
    }
    //power up screen
    if(powerUpScreen === true)
    {
      // if player has not chosen a power up yet, randomize choices
      if(powerUpChosen === false)
        randomizePowerUp();

      // draw power up selection screen
      push();
      fill(200);
      rect(windowWidth/2+200,windowHeight/2,200,100);
      rect(windowWidth/2-400,windowHeight/2,200,100);
      pop();

      push();
      fill(0);
      textSize(15);
      text(drawPowerText(choice),windowWidth/2+225,windowHeight/2+50);
      text(drawPowerText(choice2),windowWidth/2-375,windowHeight/2+50);
      pop();
    }
  } 
  // game over screen
  if(death === true)
  {
    // play player death sound
    playerDeathSound.play();
    noLoop(); // don't loop it

    bgMusic.stop(); // stop background music

    // display game over text
    push();
    shadow('rgba(0, 0, 0, 1)');
    fill(255);
    textSize(40);
    textAlign(CENTER);
    text("Game Over! Press R to restart", width/2,height/2-100);
    text("score: ");
    pop();
  }

  //draw crosshair
  push();
  shadow('rgba(0, 0, 0, 1)');
  image(spriteCrosshair, mouseX-25.5, mouseY-13.5);
  pop();
  spriteCrosshair.delay(5);
}

// Player class
class Player 
{
  constructor() 
  {
    this.pos = createVector(width/2, height/2+100); // start position
    this.vel = createVector(0, 0, 0);               // start velocity
    this.rectHeight = 25;                           // hitbox height
    this.rectWidth = 25;                            // hitbox width
    this.drag = 0.1;                                // drag factor
    this.health = 100;                              // starting health
    this.maxHealth = 100;                           // max health (not adjusted for power ups)
  }

  update() // update player position
  {
    this.mainAngle = atan2(mouseY - this.pos.y, mouseX - this.pos.x); // angle toward mouse
    this.vel.x *=(1-this.drag);     // apply drag to velocity
    this.vel.y *=(1-this.drag);
    this.pos.add(this.vel);         // update position by velocity
  }

  display() // draw player
  {
    push();
    shadow('rgba(0, 0, 0, 1)');
    translate(this.pos.x,this.pos.y);
    rotate(this.mainAngle -90);
    image(spritePlayer, -32, -32);
    pop();
  }
 
  checkMovement() // WASD movement
  {
    //-------------WASD----------------
    if (keyIsDown(87)) // W
      this.vel.y -= .75+(speedMod/7);
    
    if (keyIsDown(65)) // A
    {
      this.vel.x -= .75+(speedMod/7);
    }
    else if (keyIsDown(68)) // S
    {
      this.vel.x +=.75+(speedMod/7);
    }

    if (keyIsDown(83)) // D
      this.vel.y +=.75+(speedMod/7);
    //----------------------------------

    // constrain player to window
    this.pos.x = constrain(this.pos.x, 35, width-35);
    this.pos.y = constrain(this.pos.y, 35, height-35);
  }
  
  checkShooting()
  {
    //----------------------------------
    //    Check for shooting input
    if(keyIsDown(32) && (millis() > (lastShotTime + (500 - bulletSpeedMod*50)))) // (lastShotTime + interval between bullets)
    {
      console.log("Ran Bullet");
      playerBullet.push(new Bullet(true));

      spriteCrosshair.reset();

      // audio play shoot sound
      shootSound.play();

      lastShotTime = millis();
    }
  }

}

// Enemy class
class Enemy
{
  constructor()
  {
    if (int(random(1,3)) === 1)
    {  
      // ship appears on left or right
      this.posY = random(0,height);
      if(int(random(1,3)) === 1)
        this.posX = 0;
      else
        this.posX = width-50;
    }
    else
    {
      //ship appears on top or bottom
      this.posX = random(0,width-50);

      if(int(random(1,3)) === 1)
        this.posY = 50;
      else
        this.posY = height;

      console.log(this.posX);
      console.log(int(random(1,3)));
    }
    // position and velocity vectors
    this.pos = createVector(this.posX, this.posY);
    this.vel = createVector(.001, .001, 0);
    this.flightForce = random(0,0.008);
    this.rectHeight = 25;
    this.rectWidth = 25;
    this.drag = .01;
    // initial angle toward the player (use atan2 so we get direction)
    this.mainAngle = atan2(player.pos.y - this.pos.y, player.pos.x - this.pos.x);

  }

  update() // update enemy position
  {
    // recalc angle toward player each frame
    this.mainAngle = atan2(player.pos.y - this.pos.y, player.pos.x - this.pos.x);
    // apply thrust toward player, then drag, then move
    this.applyTanForce(this.flightForce);
    this.vel.x *=(1-this.drag);
    this.vel.y *=(1-this.drag);
    this.pos.add(this.vel);
  }

  display() // draw enemy
  {
    push()
    shadow('rgba(0, 0, 0, 1)');
    translate(this.pos.x,this.pos.y);
    rotate(this.mainAngle+270);
    image(spriteEnemy, -32, -32);
    pop()
  }

  applyTanForce(force)
  {
    // add force in the direction of mainAngle (negative to point toward player)
    this.vel.x += (force * cos(this.mainAngle));
    this.vel.y += (force * sin(this.mainAngle));
  }
         
}

// Bullet class
class Bullet
{
  constructor(playerOrEnemy)
  {
    // playerOrEnemy = true for player bullet, false for enemy bullet
    if(playerOrEnemy === true)
    {
      this.color = ('#ffffff');

      this.flightForce = 15;
      this.angle = player.mainAngle-180;
      this.pos = createVector(player.pos.x,player.pos.y);
      this.vel = createVector(0, 0);
      this.size = 10;
      this.arr = playerBullet;
    }
    else
    {
      this.color = ('#ff0000');

      this.flightForce = 5;
      this.angle = enemyShips[i].mainAngle-180;
      this.pos = createVector(enemyShips[i].pos.x,enemyShips[i].pos.y);
      this.vel = createVector(0, 0);
      this.size = 10;
      this.arr = enemyBullet;
    }
  }

  update()  // update bullet position
  {
    this.applyTanForce(this.flightForce);
    this.pos.add(this.vel);

    // remove bullet if it goes off screen
    if (this.pos.x >= width || this.pos.x <= 0 || this.pos.y >= height || this.pos.y <= 0)
    {
      this.arr.splice(i,1);
      console.log(enemyBullet.length)
    }
  }

  display() // draw bullet
  {
    push()
    //translate(this.pos.x,this.pos.y);
    strokeWeight(2);
    fill(this.color); 
    circle(this.pos.x,this.pos.y,this.size);
    pop();
  }

  applyTanForce(force) // move bullet in direction of angle
  {
    this.vel.x =(force*-cos(this.angle));
    this.vel.y =(force*-sin(this.angle));
  }
    
}

// Background column class
class BgCol 
{
  constructor(xpos) 
  {
    this.xpos = xpos;
  }

  display() // draw background column
  {
    // speed of background movement
    this.xpos += map(cos(frameCount), 0, 0.5, 0.5, 1);

    // draw background tiles in column
    for (let j = 0; j < height; j += bgTile.height) 
    {
      image(bgTile, this.xpos, j);
    }
    // remove column if it moves off screen
    if (this.xpos >= width+bgTile.width) 
    {
      bgArray.shift();
    }
  }

  getXpos() 
  {
    return this.xpos;
  }
}

// small health pack drops during gameplay
class SmallHealthPack 
{
  constructor(xpos, ypos) 
  {
    this.pos = createVector(xpos, ypos);
    this.size = 20;
  }

  display() // draw health pack
  {
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

  getPos() 
  {
    return this.pos;
  }
}

// small health pack pickup
function smallHPPickup()
{
  player.health += 20;  // increase player health by 20

  // play health pack pickup sound
  healthPackSound.play();

  // cap player health to max health
  if (player.health > player.maxHealth)
    player.health = player.maxHealth;
}

// draw moving background
function drawBg() 
{
  // draw background columns as each column moves off screen
  for (let i = 0; i < bgArray.length; i++) 
  {
    bgArray[i].display();
  }
  // add new column if last column is fully on screen
  if (bgArray[bgArray.length - 1].getXpos() > 0)
  {
    bgArray.push(new BgCol(-bgTile.width+2));
  }
}

// initialize background columns
function initBg() 
{
  // create initial background columns to fill screen
  for (let i = width; i > -bgTile.width; i -= bgTile.width)
  {
    bgArray.push(new BgCol(i));
  }
}

// key press events
function keyPressed()
{
  // hide start menu text on any key press except ESCAPE
  if (keyCode !== ESCAPE)
    showText = false;

  // restart game on R key press if player is dead
  if((key === "r" || key === "R") && death === true)
  {
    resetGame();
    death = false;
  }

  // spawn enemy on P key press (debugging)
  if(key === "p" || key === "P")
  {
    console.log("ran");
    enemyShips.push(new Enemy());
  }

  // pause game on ESCAPE key press
  if(keyCode === ESCAPE)
  {
    pauseGame();
  }

  // start wave on ENTER key press
  if(keyCode === ENTER){
   start = true;
  }

  // change enemy sprite on F1 key press (debugging (sorta))
  if(keyCode === 112)
  {
    spriteEnemy = loadImage('libraries/enemy.png');
  }
}

// display start menu text
function startMenu()
{
  // start game text
  if (showText) 
  {
    push();
    shadow('rgba(0, 0, 0, 1)');
    fill(255);
    textSize(20);
    textAlign(CENTER);
    text("Use WASD to move, mouse to aim, Space to shoot, Enter to start wave.", width/2, 150);
    textSize(40);
    text("Press any key to start", width/2, height/2);
    pop();
  }
}

// play background music
function backgroundMusicPlay()
{
  if (!showText) 
  {
    if (!bgMusic.isPlaying()) 
    {
      bgMusic.setVolume(bgVolume);
      bgMusic.play();
    }
  }
}

// enemy shooting function
function runBullet()
{
  // shoot bullet from each enemy ship
  for(i = 0; i<enemyShips.length; i++)
    enemyBullet.push(new Bullet(false));
}

// check collision between health pack and player
function checkHealthPackCollision(healthPos,rectPos,rectWidth,rectHeight,angle)
{
  rectX = rectPos.x;
  rectY = rectPos.y;
  rectW = rectWidth;
  rectH = rectHeight;
  hPackW = 20;
  hPackH = 20;
  hPackX = healthPos.x;
  hPackY = healthPos.y;

  // check collision between health pack and player rectangle
  if (
    rectX + rectY > hPackX && // right edge of circle > left edge of rectangle
    rectX - rectY < hPackX + hPackW && // left edge of circle < right edge of rectangle
    rectY + rectX > hPackY && // bottom edge of circle > top edge of rectangle
    rectY - rectX < hPackY + hPackH
  )
  {
    // top edge of health < bottom edge of rectangle
    if (hPackX + hPackW > rectX && hPackX < rectX) 
    {
      // health hit left edge of rectangle
      return true;
    }
    else if (hPackX - hPackW < rectX + rectW && hPackX > rectX + rectW)
    {
      // health hit right edge of rectangle
      return true;
    }
    else if (hPackY + hPackH > rectY && hPackY < rectY)
    {
      // health hit top edge of rectangle
      return true;
    }
    else if (hPackY - hPackH < rectY + rectH && hPackY > rectY + rectH)
    {
      // health hit bottom edge of rectangle
      return true;
    }
  }
  else 
  {
    collisionSide = "";
  }
}

// check collision between bullet and rectangle (enemy or player)
function checkCollision(bulletPos,rectPos,circleSize,rectWidth,rectHeight,angle)
{
  circleX = bulletPos.x;
  circleY = bulletPos.y;
  rectX = rectPos.x - rectWidth/2;
  rectY = rectPos.y - rectHeight/2;
  circleR = circleSize*2;
  rectW = rectWidth;
  rectH = rectHeight;
  hPackW = 20;
  hPackH = 20;

  if (
    circleX + circleR > rectX && // right edge of circle > left edge of rectangle
    circleX - circleR < rectX + rectW && // left edge of circle < right edge of rectangle
    circleY + circleR > rectY && // bottom edge of circle > top edge of rectangle
    circleY - circleR < rectY + rectH
  )
  {
    // top edge of circle < bottom edge of rectangle
    if (circleX + circleR > rectX && circleX < rectX) 
    {
      // circle hit left edge of rectangle
      return true;
    } 
    else if (circleX - circleR < rectX + rectW && circleX > rectX + rectW) 
    {
      // circle hit right edge of rectangle
      return true;
    } 
    else if (circleY + circleR > rectY && circleY < rectY)  
    {
      // circle hit top edge of rectangle
      return true;
    } 
    else if (circleY - circleR < rectY + rectH && circleY > rectY + rectH) 
    {
      // circle hit bottom edge of rectangle
      return true;
    }
  } 
  else 
  {
    collisionSide = "";
  }
}

// handle window resize
function windowResized() 
{
  resizeCanvas(windowWidth, windowHeight);
  
  // reinitialize/redraw background columns on window resize
  initBg(); 
  draw();
  
  // ensure the game stays paused on resize
  /*
  *  small bug - when actively resizing the game continues
  *  to run, meaning enemies can attack you and you can die
  *  if you just keep resizing
  */
  paused = false;
  pauseGame();
}

// pause and resume game
function pauseGame() 
{
  if (!paused && !showText) 
  {
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

  } 
  else if (paused && !showText)
  {
    frameRate(60); // resume the game
    bgMusic.play(); // resume background music
    noCursor(); //hide cursor
  }
  paused = !paused;
}

// reset game state
function resetGame()
{
  window.location.reload(); // goofy way to reset, but it works
  /*
  player.maxHealth = 100;
  player.health = 100;
  score = 0;
  player.pos.x = width/2;
  player.pos.y = height/2+100;
  enemyShips = [];
  playerBullet = [];
  enemyBullet = [];
  wave = 1;
  enemyCount = 3;
  enemyKills = 0;*/
}

// set shadow properties
function shadow(color, blurRadius = 10, offsetX = 0, offsetY = 0) 
{
  drawingContext.shadowColor = color;
  drawingContext.shadowBlur = blurRadius;
  drawingContext.shadowOffsetX = offsetX;
  drawingContext.shadowOffsetY = offsetY;
}

// spawn a new enemy ship
function spawnEnemy()
{
  enemyShips.push(new Enemy());
}

// handle end of wave
function endWave()
{
  enemyShips = [];
  playerBullet = [];
  enemyBullet = [];
  enemyKills = 0;
  enemyCount = ((3)+((wave-1)*2));
  start = false;

  if(wave >= 30)
    spawnTimeCooldownModifier = 700;
  else if(wave >= 25)
    spawnTimeCooldownModifier = 600;
  else if(wave >= 20)
    spawnTimeCooldownModifier = 500;
  else if (wave >= 10)
    spawnTimeCooldownModifier = 400;
  else if (wave >= 5)
    spawnTimeCooldownModifier = 200;

  powerUpScreen = true;
  powerUpChosen = false;
  
  
}

// handle start of wave
function startWave()
{
  if(started === false){
    spawnTime = millis();
    started = true;
  }
}

// randomize power up choices
function randomizePowerUp()
{
  choice = (int(random(0,4)));
  choice2 = (int(random(0,4)));

  while(choice === choice2)
  {
    choice2 = (int(random(0,4)));
  }
  powerUpChosen = true;
}

// draw power up text based on selected power
function drawPowerText(selectedPower)
{
  if(selectedPower === 0)
   return("Increase Fire Rate");
  else if(selectedPower === 1)
    return("Increase Health On Kill");
  else if (selectedPower === 2)
    return("increase Max HP by 10");
  else 
    return("increase Speed"); 
}

// handle mouse press events
function mousePressed()
{ 
  if(powerUpScreen === true)
  {   //power up 1
    if (mouseX > (windowWidth/2+200) && mouseX < (windowWidth/2+200) + 200 && mouseY > windowHeight/2 && mouseY < windowHeight/2 + 100) {
      console.log("choice1");
      powerUp(choice);
      powerUpScreen = false;
    }
    // power up 2
    if (mouseX > (windowWidth/2-400) && mouseX < (windowWidth/2-400) + 200 && mouseY > windowHeight/2 && mouseY < windowHeight/2 + 100) {
      console.log("choice2");
      powerUp(choice2);
      powerUpScreen = false;
    }
  }
}

// apply selected power up effects
function powerUp(power)
{
 if(power === 0)
 {
  console.log("bullet increase")
  bulletSpeedMod++;
 }
  else if(power === 1){
    console.log("Heal on kill increase")
    healOnKillMod++;
  }
  else if (power === 2){
    console.log("max Health increase")
    player.maxHealth += 10;
  }
    else {
    console.log("speed increase")
    speedMod++;
    }
}
