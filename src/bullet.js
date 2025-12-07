class Bullet {
  constructor(type) {
    if (type == 1) {
      this.color = ('#ffffff');

      this.flightForce = 15;
      this.angle = player.mainAngle-180;
      this.pos = createVector(player.pos.x,player.pos.y);
      this.vel = createVector(0, 0);
      this.size = 10;
      this.arr = playerBulletArr;
    } else if (type == 2) {
      this.color = ('#ff0000');

      this.flightForce = 5;
      this.angle = enemyCopters[i].mainAngle-180;
      this.pos = createVector(enemyCopters[i].pos.x,enemyCopters[i].pos.y);
      this.vel = createVector(0, 0);
      this.size = 10;
      this.arr = enemyBulletArr;

    } else if (type == 3) {
      this.color = ('#360962');
      this.flightForce = 8;
      this.angle = bossCopters[i].mainAngle-180;
      this.pos = createVector(bossCopters[i].pos.x,bossCopters[i].pos.y);
      this.vel = createVector(0, 0);
      this.size = 15;
      this.arr = bossBulletArr;
    }

  }
  update() {
    this.applyTanForce(this.flightForce);
    this.pos.add(this.vel);

    // If the bullet leaves the bounds of the window, splice it from its respective array
    if (this.pos.x >= width || this.pos.x <= 0 || this.pos.y >= height || this.pos.y <= 0)
    {
      this.arr.splice(i,1);
    }
  }
  display() {
    push()
    //translate(this.pos.x,this.pos.y);
    strokeWeight(2);
    fill(this.color);
    circle(this.pos.x,this.pos.y,this.size);
    pop();
  }

  applyTanForce(force) {
    this.vel.x =(force*-cos(this.angle));
    this.vel.y =(force*-sin(this.angle));
  }
    
}

function runBullet() {
  for (i = 0; i < enemyCopters.length; i++)
    enemyBulletArr.push(new Bullet(2));
  for (i = 0; i < bossCopters.length; i++)
    bossBulletArr.push(new Bullet(3));
}