let showText = true;
let paused = false;

let player;
let spritePlayer, spriteEnemy, spriteCrosshair, clouds, bgTile;
let enemyShips = [];
let playerBullet = [];
let lastShotTime;
let death = false;
let score = 0;
let wave = 1;
let bgVolume = 0.25;
let bulletVolume = 0.05;
let bgArray = [];

let smallHealthPacks = [];
let healthScore = 0;

// preload sound
let shootSound;
let bgMusic;

function preload() 
{
  soundFormats('mp3', 'ogg', 'wav');

  spriteEnemy = loadImage('assets/enemy.gif');
  spritePlayer = loadImage('assets/player.gif');
  spriteCrosshair = loadImage('assets/crosshair.gif');
  bgTile = loadImage('assets/bgTile.png');
  pause = loadImage('assets/pause.png');

  shootSound = loadSound('assets/sounds/Pew.wav');
  shootSound.setVolume(bulletVolume);

  bgMusic = loadSound('assets/sounds/menu_music_potentially.wav');
  // play background music in loop
  bgMusic.setVolume(bgVolume);
  bgMusic.loop();
}

let enemyBullet = [];
let bulletInterval = setInterval(runBullet, 1000);

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
  drawBg();
  noCursor();
  
  startMenu();

  backgroundMusicPlay();

  if (player.health <= 0)
    death = true;

  if (death === false)
  {
    player.checkMovement();
    player.checkShooting(); //rapid fire function
    player.update();
    player.display();
    for (i = 0; i < enemyShips.length; i++)
    {
      enemyShips[i].applyTanForce(.01);  
      enemyShips[i].update();  
      enemyShips[i].display();
    } 

    for (i = 0; i < playerBullet.length; i++)
    {
      const pb = playerBullet[i];
      pb.applyTanForce(.1);
      pb.update();
      pb.display();

      for (j = 0; j < enemyShips.length; j++)
      {
        if (playerBullet.length != 0 && checkCollision(pb.pos,enemyShips[j].pos,pb.size,enemyShips[j].rectWidth,enemyShips[j].rectHeight,pb.mainAngle))
        {
          enemyShips.splice(j,1);
          j--;
          playerBullet.splice(i,1);
          i--;
          score += 10;

          healthScore += 10;
        }
      }
    }

    for(i = 0; i < enemyBullet.length; i++)
    {
      enemyBullet[i].applyTanForce(.1);
      enemyBullet[i].update();
      enemyBullet[i].display();
      if(checkCollision(enemyBullet[i].pos,player.pos,enemyBullet[i].size,player.rectWidth,player.rectHeight,player.mainAngle)) 
      {
        enemyBullet.splice(i,1);
        i--;
        player.health -= 10;
      }
    }
    

    //draw health bar
    push();
    shadow('rgba(0, 0, 0, 1)');
    fill(0);
    rect(player.pos.x-35,player.pos.y+((player.pos.y < height-60) ? 40 : -50), map(player.maxHealth,0,100,0,70),13); //max health
    pop();
    fill('rgba(0, 192, 35, 1)');
    rect(player.pos.x-35,player.pos.y+((player.pos.y < height-60) ? 40 : -50),map(player.health,0,100,0,70),13); //current health
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
      let hpX = enemyShips.length > 0 ? enemyShips[0].pos.x : random(50, width - 50);
      let hpY = enemyShips.length > 0 ? enemyShips[0].pos.y : random(50, height - 50);
      smallHealthPacks.push(new smallHealthPack(hpX, hpY));
    }

    // draw health packs
    for (let h = 0; h < smallHealthPacks.length; h++) 
    {
      smallHealthPacks[h].display();
      if (checkHealthPackCollision(smallHealthPacks[h].getPos(), player.pos, player.rectWidth, player.rectHeight, player.mainAngle)) 
      {
        smallHealthPacks.splice(h, 1);
        smallHPPickup();
        h--;

        healthScore = 0; // reset health score to prevent multiple spawns
      }
    }

    // remove health pack after short duration
    if (smallHealthPacks.length > 0) 
    {
      setTimeout(() => {
        smallHealthPacks.shift();
      }, 10000); // remove after 10 seconds
    }
  } 
  
  if(death === true)
  {
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


class Player 
{
  constructor() 
  {
    this.squareSize = 50;
    this.pos = createVector(width/2, height/2+100);
    this.vel = createVector(0, 0, 0);
    this.rectHeight = 25;
    this.rectWidth = 25;
    this.drag = 0.1;
    this.health = 100;
    this.maxHealth = 100;
    this.fireRate = 150;
    this.healOnKill;
    this.defense;
  }
  update() 
  {
    this.mainAngle = atan2(mouseY - this.pos.y, mouseX - this.pos.x);
    this.vel.x *=(1-this.drag);
    this.vel.y *=(1-this.drag);
    this.pos.add(this.vel);
  }
  display() 
  {
    push();
    shadow('rgba(0, 0, 0, 1)');
    translate(this.pos.x,this.pos.y);
    rotate(this.mainAngle -90);
    image(spritePlayer, -32, -32);
    pop();
  }
 
  checkMovement()
  {
    //-------------WASD----------------
    if (keyIsDown(87)) // W
      this.vel.y -= .75;
    
    if (keyIsDown(65)) // A
    {
      this.vel.x -= .75;
    }
    else if (keyIsDown(68)) // S
    {
      this.vel.x +=.75;
    }

    if (keyIsDown(83)) // D
      this.vel.y +=.75;
    //----------------------------------
    //          Afterburner

    // constrain player to window
    this.pos.x = constrain(this.pos.x, 35, width-35);
    this.pos.y = constrain(this.pos.y, 35, height-35);
  }
  
  checkShooting()
  {
    //----------------------------------
    //    Check for shooting input
    if(keyIsDown(32) && (millis() > (lastShotTime + 150))) // (lastShotTime + interval between bullets)
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

class Enemy
{
  constructor()
  {
    if (int(random(1,3)) === 1)
    {  
      //ship appears on left or right
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

    this.squareSize = 50;
    this.pos = createVector(this.posX, this.posY);
    this.vel = createVector(.001, .001, 0);
    this.flightForce = random(0,0.008);
    this.rectHeight = 25;
    this.rectWidth = 25;
    this.drag = .01;
    // initial angle toward the player (use atan2 so we get direction)
    this.mainAngle = atan2(player.pos.y - this.pos.y, player.pos.x - this.pos.x);

  }
  update() 
  {
    // recalc angle toward player each frame
    this.mainAngle = atan2(player.pos.y - this.pos.y, player.pos.x - this.pos.x);
    // apply thrust toward player, then drag, then move
    this.applyTanForce(this.flightForce);
    this.vel.x *=(1-this.drag);
    this.vel.y *=(1-this.drag);
    this.pos.add(this.vel);
  }
  display() 
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
  
  class Bullet
  {
  constructor(playerOrEnemy)
  {
    if(playerOrEnemy === true)
    {
      this.color = ('#ffffff');
      this.flightForce = 15;
      this.angle = player.mainAngle-180;
      this.pos = createVector(player.pos.x,player.pos.y);
      this.vel = createVector(0, 0);
      this.size = 5;
    }
    else
    {
      this.color = ('#ff0000');
      this.flightForce = 5;
      this.angle = enemyShips[i].mainAngle-180;
      this.pos = createVector(enemyShips[i].pos.x,enemyShips[i].pos.y);
      this.vel = createVector(0, 0);
      this.size = 5;
    }
  }
  update()
  {
    this.applyTanForce(this.flightForce);
    this.pos.add(this.vel);
  }
  display()
  {
    push()
    //translate(this.pos.x,this.pos.y);
    shadow('rgba(0, 0, 0, 1)');
    fill(this.color);
    

    circle(this.pos.x,this.pos.y,this.size);
    pop();
  }
  applyTanForce(force) 
  {
    this.vel.x =(force*-cos(this.angle));
    this.vel.y =(force*-sin(this.angle));
  }
    
}

class BgCol {
  constructor(xpos) 
  {
    this.xpos = xpos;
  }

  display() {
    // speed of background movement
    this.xpos += map(cos(frameCount), 0, 0.5, 0.5, 1);

    for (let j = 0; j < height; j += bgTile.height) 
    {
      image(bgTile, this.xpos, j);
    }
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
class smallHealthPack {
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
function smallHPPickup()
{
  player.health += 20;
  if (player.health > player.maxHealth)
    player.health = player.maxHealth;
}

function drawBg() {
  // draw background columns as each column moves off screen
  for (let i = 0; i < bgArray.length; i++) 
  {
    bgArray[i].display();
  }
  if (bgArray[bgArray.length - 1].getXpos() > 0)
  {
    bgArray.push(new BgCol(-bgTile.width+2));
  }
}

function initBg() {
  // initialize background columns
  for (let i = width; i > -bgTile.width; i -= bgTile.width)
  {
    bgArray.push(new BgCol(i));
  }
}
  
function keyPressed()
{
  if (keyCode !== ESCAPE)
    showText = false;

  if((key === "r" || key === "R") && death === true)
  {
    resetGame();
    death = false;
  }
  if(key === "p" || key === "P")
  {
    console.log("ran");
    enemyShips.push(new Enemy());
  }
  if(keyCode === ESCAPE)
  {
    pauseGame();
  }


  if(keyCode === 112)
  {
    spriteEnemy = loadImage('libraries/enemy.png');
  }
}

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
    text("Use WASD to move, mouse to aim, Space to shoot, P to spawn enemy ships", width/2, 150);
    textSize(40);
    text("Press any key to start", width/2, height/2);
    pop();
  }
}

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

function runBullet()
{
  for(i = 0; i<enemyShips.length; i++)
    enemyBullet.push(new Bullet(false));
}

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

function checkCollision(bulletPos,rectPos,circleSize,rectWidth,rectHeight,angle)
{
  circleX = bulletPos.x;
  circleY = bulletPos.y;
  rectX = rectPos.x;
  rectY = rectPos.y;
  circleR = circleSize*2;
  rectW = rectWidth;
  rectH = rectHeight;
  hPackW = 20;
  hPackH = 20;
  //hPackX = healthPos.x;
  //hPackY = healthPos.y;

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
// health pack collision
  /*if (
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
  }*/
}

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

function pauseGame() {

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

function resetGame()
{
  player.maxHealth = 100;
  player.health = 100;
  score = 0;
  player.pos.x = width/2;
  player.pos.y = height/2+100;
  enemyShips = [];
  playerBullet = [];
  enemyBullet = [];
}

function shadow(color, blurRadius = 10, offsetX = 0, offsetY = 0) 
{
  drawingContext.shadowColor = color;
  drawingContext.shadowBlur = blurRadius;
  drawingContext.shadowOffsetX = offsetX;
  drawingContext.shadowOffsetY = offsetY;
}