let wave = 1;
let spawnTimeCooldownModifier = 0;
let enemyCount = 3;
let start = false;
let enemyKills = 0;
let eSpawnTime;
let started = false;

function endWave() {
  enemyCopters = [];
  bossCopters = [];
  playerBulletArr = [];
  enemyBulletArr = [];
  bossBulletArr = [];
  enemyKills = 0;
  bossKills = 0;
  enemyCount = ((3)+((wave-1)*2));
  bossCount = (Math.round(wave/5));
  start = false;
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
  if (started == false) {
    eSpawnTime = millis();
    bSpawnTime = millis();
    started = true;
  }
}