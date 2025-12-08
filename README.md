🔹 1. Ideation Phase
How did the idea emerge?

before our idea for "Top Copter" was created, we initally wanted to create a customization game, but not soon after we completly switched gears, and used Alex's love of aviation to pivot into a helicopter "Bullet-Hell" style game.

What artistic/technical goals guided your early thinking?

Our main technical goal was always based around a endless game. This led to our scaling wave system, which lets the user play for as long as they are able to survive the waves.

🔹
 2. Collaboration Phase
How did you divide responsibilities?

Alex focused on the foundation of the code, and creating rought models of the game systems that we would be implementing

Adrian focused on polishing these game systems and making them more appealing and easy to understand for the user, along with inputting sprites.

Luke focused on the music and sound effects of the game, giving the user feedback when taking out an enemy, or taking damage, along with working on some core systems such as the health packs.

What was the GitHub workflow like for your team?

Our github workflow was very simple. We mainly developed independently, working on our own parts in our own time, then pushing to a dev branch when our parts were complete and without issues. In the event that we had a peice of code that we could not figure out, we would push then make sure it's known in a group chat we have. This made it easy to keep everyone up to date on the project and make sure everyone could work in their own time. 

🔹
 3. Coding & Development Phase
Each member of the group should briefly speak about:

Your personal contribution to the project

Alex - I mainly worked on the backend of the game, specifically with movement, enemy attacks, power ups, and others.

Adrian - I mainly focused on more visual elements, such as the background, assets, and organizing visual elements. Later on in the project, I also created bosses that show up every 5 waves and also did a refactor/code base clean up.


Your experience working collaboratively

Alex - I had a great time working my group mates! due to the fact that we all worked on different things, it prevented overlap and allowed us to all work at our own pace and as efficently as possible.

Adrian - My partners were all very helpful and I think that we made a good team. We were able to on and off work on the project whenever we had spare time, and this led to efficient development of our project over time. The use of Git and GitHub streamlined our collaborative process.


Any specific functions, classes, or features you worked on

Alex - I worked on The Player,Enemy,and Bullet classes, along with Power ups and hit detection

Adrian - I worked mainly on the background functions/classes and boss functions/classes.


What aspects of the code worked exactly as you hoped didn’t work at first, and how you solved or re-designed them

Alex - The power up code worked almost perfectly on the first try. The piece of code that gave me the most trouble was the movement of our player. Originally, we had the player sliding around the map, similar to a airplane. However, when testing further, we came across problems with player precision with our movement, causing us to divert to a helicopter instead of a plane. 

Adrian - When I created the boss feature, it worked on basically my first try. This is mainly because we already had a similar frame work for the enemies, so porting all of that to make a bigger boss enemy was not too hard. An aspect of the code that I really struggled with for a while was how to tile the background in order to make it move. At first, I drew the entire background using for loops, and attempted to tile those larger background tiles for the illusion of movement. This didn't really work though, as there were too many visual artifacts. So, I changed my approach and instead decided to tile in columns that move across the screen, which worked much better.

🔹
 4. Technical Highlights
Show and explain:


The parts of your code you’re most proud of

The part of our code that we are the most proud of is our self-contained collision code. Instead the collisions being checked inside the draw function for each object, all enemies, bosses, and player are checking for their own collision, preventing errors that lead to checking collisions with undefined objects.

Any creative or unexpected solutions

The self-contained collision that we are so proud of stems from a very unexpected solution. We were having errors when a bullet would be checked for the collision against undefined objects, causing game crashes. The solution to this, was the self-contained collision, that made it so a object could only check if it collided with a bullet instead of checking the bullet collision on a undefined enemy.

How your project evolved from idea → prototype → finished piece

Our original idea for the game was know as top planes, which had a different movement system to the player character with a much more slidey feel to it. once we created the prototype, we switched over to the helicopter system of movement that we currently have in the game. our finished peice involved lots of balancing, and making the game enjoyable for the user to play, and adding new mechanics such as bosses and power ups