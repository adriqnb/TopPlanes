/**
 * waves.js
 *
 * Contains code related to the wave system
 */
let wave = 1;
let spawnTimeCooldownModifier = 0; // spawn cooldown time for enemies
let start = false; // whether to start the wave or not
let started = false; // has the wave started

// end the wave and reset all variables
function endWave() {
  // clear all arrays
  enemyCopters = [];
  bossCopters = [];
  playerBulletArr = [];
  enemyBulletArr = [];
  bossBulletArr = [];

  // reset enemy kills
  enemyKills = 0;
  bossKills = 0;
  
  // change the amount of enemies/bosses that spawn per wave
  enemyCount = ((3)+((wave-1)*2)); // every wave, add 3 enemies
  bossCount = (Math.round(wave/5)); // every 5 waves, add a boss

  start = false;

  // increase spawning based on the wave
  if (wave >= 30)
    spawnTimeCooldownModifier = 700;
  else if (wave >= 25)
    spawnTimeCooldownModifier = 600;
  else if (wave >= 20)
    spawnTimeCooldownModifier = 500;
  else if (wave >= 10)
    spawnTimeCooldownModifier = 400;
  else if (wave >= 5)
    spawnTimeCooldownModifier = 200;

  powerUpScreen = true;
  powerUpChosen = false;
}

function startWave() {
  // if wave has not started
  if (started == false) {
    eSpawnTime = millis(); // last spawned enemy time
    bSpawnTime = millis(); // last spawn boss time
    started = true; // wave has started
  }
}

function updateWave() {
  // if wave should be started
  if (start) {
    startWave();
    // handle enemy spawning
    if ((millis() > (eSpawnTime + 1000-(wave*10))) && ((enemyCount-enemyKills) > (enemyCopters.length))) {
      spawnEnemy();
      eSpawnTime = millis(); // last spawned enemy time
    }
    // handle boss spanwing
    if ((millis() > (bSpawnTime + 1000-(wave*10))) && ((bossCount-bossKills) > (bossCopters.length)) && ((wave % 5) == 0)) {
      spawnBoss();
      bSpawnTime = millis(); // last spawn boss time
    }
    
    // if the wave is a multiple of 5
    if (((wave % 5) == 0)) {
      // if all enemies and bosses are dead
      if (enemyCount <= enemyKills && bossCount <= bossKills) {
        wave++; // increment wave
        endWave();
      }
    } else {
      // if all enemies are dead
      if (enemyCount <= enemyKills) {
        wave++; // increment wave
        endWave();
      }
    }
  }
}