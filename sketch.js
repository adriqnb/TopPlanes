let enemyShips = [];
function setup() {
  createCanvas(windowWidth,windowHeight);
}

function draw() {
  background('#0071a7');

  for(i=0; i<enemyShips.length; i++)
    enemyShips[i].drawShip();
}

class Ship
{
  constructor(enemy){

      if (int(random(1,3)) === 1){  
        //ship appears on left or right
        this.posY = random(0,windowHeight);
        if(int(random(1,3)) === 1)
          this.posX = 0;
        else
          this.posX = windowWidth-50;
      }
      else
      {
        //ship appears on top or bottom
        this.posX = random(0,windowWidth-50);
        if(int(random(1,3)) === 1)
          this.posY = 50;
        else
          this.posY = windowHeight;
        console.log(this.posX);
        console.log(int(random(1,3)));
      }

  }

  drawShip()
  {
   fill(255);
   rect(this.posX,this.posY-50,50,50);
  }
}

function keyPressed()
{
  if(key === "p")
    enemyShips.push(new Ship());
  console.log(enemyShips);
}