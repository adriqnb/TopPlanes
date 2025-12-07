function isCollision(bulletPos,rectPos,circleSize,rectWidth,rectHeight) {
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
  ) {
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
}