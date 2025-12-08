# Top Copter

🔹 1. Ideation Phase
- How did the idea emerge?

Before our idea for "Top Copter" was created, we initally wanted to create a customization game. This game was going to be about customizing outfits by selecting from a wide array of clothing items. Not soon after, we completely switched gears. We used Alex's love of aviation to pivot into a helicopter "Bullet-Hell" style game.

- What artistic/technical goals guided your early thinking?

Our main technical goal was always based around a endless game. This led to our scaling wave system, which lets the user play for as long as they are able to survive the waves.

🔹 2. Collaboration Phase
- How did you divide responsibilities?

Alex focused on the foundation of the code, and creating rough models of the game systems that we would be implementing

Adrian focused on polishing these game systems and making them more appealing and easy to understand for the user, along with inputting sprites.

Luke focused on the music and sound effects of the game, giving the user feedback when taking out an enemy, or taking damage, along with working on some core systems such as the health packs.

- What was the GitHub workflow like for your team?

Our GitHub workflow was very simple yet helpful. We mainly developed independently, working on our own parts in our own time, then pushing to a dev branch when our parts were complete and without issues. In the event that we had a piece of code that we could not figure out, we would push then make sure it's known in a group chat we have. This made it easy to keep everyone up to date on the project and make sure everyone could work in their own time. 

🔹 3. Coding & Development Phase
- Your personal contribution to the project:

Alex - I mainly worked on the backend of the game, specifically with movement, enemy attacks, power ups, and others.

Adrian - I mainly focused on more visual elements, such as the background, assets, and organizing visual elements. Later on in the project, I also created bosses that show up every 5 waves and also did a refactor/code base clean up.

Luke - My focus was primarily aimed at the audio portion, meaning the SFX, background music, mixing/balancing, and their triggering. I also worked on the health packs and their initial functionality.


- Your experience working collaboratively:

Alex - I had a great time working my group mates! due to the fact that we all worked on different things, it prevented overlap and allowed us to all work at our own pace and as efficently as possible.

Adrian - My partners were all very helpful and I think that we made a good team. We were able to on and off work on the project whenever we had spare time, and this led to efficient development of our project over time. The use of Git and GitHub streamlined our collaborative process.

Luke - Working in this group was quite the enjoyable experience, as everyone had the drive to want to keep making the project as fun as it could be. We all cycled working on various portions of the game, providing ideas and help, and as previously mentioned Github made this extremely easy to do.

- Any specific functions, classes, or features you worked on:

Alex - I worked on the Player, Enemy, and Bullet classes, along with Power ups and hit detection.

Adrian - I worked mainly on the background functions/classes and boss functions/classes.

Luke - I mainly worked on the health packs and sound-related functions, but I also "fixed" the game reset function with a slightly silly, but workable method.

- What aspects of the code worked exactly as you hoped didn’t work at first, and how you solved or re-designed them:

Alex - The power up code worked almost perfectly on the first try. The piece of code that gave me the most trouble was the movement of our player. Originally, we had the player sliding around the map, similar to a airplane. However, when testing further, we came across problems with player precision with our movement, causing us to divert to a helicopter instead of a plane. 

Adrian - When I created the boss feature, it worked on basically my first try. This is mainly because we already had a similar frame work for the enemies, so porting all of that to make a bigger boss enemy was not too hard. An aspect of the code that I really struggled with for a while was how to tile the background in order to make it move. At first, I drew the entire background using for loops, and attempted to tile those larger background tiles for the illusion of movement. This didn't really work though, as there were too many visual artifacts. So, I changed my approach and instead decided to tile in columns that move across the screen, which worked much better.

Luke - At first the health packs weren't spawning at the correct locations (the latest enemy killed), but instead were spawning at currently still alive enemy locations. I later realized the reason for this was because of how .splice works, meaning once the enemy that was just destroyed was removed from the array, the next one to fill in that space would be the spawn location. However, by declaring the pack location variables as global variables, then having them get the location of the enemy first, then pushing the pack, then getting the new location, the problem was solved. In reality this should've been the way I wrote it initially, but I tried to take a shortcut, and if there's anything I've learned it's that shortcuts aren't always viable.

🔹 4. Technical Highlights
- The parts of your code you’re most proud of:

The part of our code that we are the most proud of is our self-contained collision code. Instead of the collisions being checked inside the draw function for each object in a loop, all enemies, bosses, and the player objects are checking for their own collisions. This prevents errors that come from checking collisions with undefined objects.

- Any creative or unexpected solutions:

The self-contained collision that we are so proud of stems from a very unexpected solution. We were having errors when a bullet would be checked for the collision against undefined objects, causing game crashes. The solution to this, was the self-contained collision. It made it so an object could only check if it collided with a bullet instead of checking the bullet collision on a undefined enemy.

- How your project evolved from idea → prototype → finished piece:

Our original idea for the game was known as Top Planes, which had a different movement system to the player character with a much more slidey feel to it. Once we created the prototype, we switched over to the helicopter system of movement that we currently have in the game. Our finished game involved lots of balancing, and making the game enjoyable for the user to play, and adding new mechanics such as bosses and power ups.