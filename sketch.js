/*
Losheni Meenakshi Sundaram – Game Project Finals
Extensions Chosen: 1. Add Sounds
	1. Add Sounds
     What I Found Difficult:
I initially had trouble playing some sounds within the draw loop. As the music played continuously, it had a weird sound and an undesirable echo effect at first. I also encountered the problem of sound playing in the next game session. For example, the game won sound continued to play even when a new game session had started.
        	
    Skills Learnt/Practiced by implementing it:
   To resolve the above issues, I tried debugging and referring to GitHub and YouTube for examples. The first step I took was to re-read the p5 documentation on sound (from P5.js reference) and see if any built-in functions solved my problems. I began to understand my problem more at which point I could see possible solutions. Ultimately I ended up adding a restart game function (that would be useful for other features too) and a Boolean to track whether or not the game over sound had been played.
        	                
Additional Notes:
Some of the more advanced graphics are evident in the shading of the scenery objects, which I did for the trees. Other than that, instead of 1 mountain, I drew 2 mountains to make it look like there are multiple mountains depicting picturesque scenery. Also, I change the shapes of clouds and put them at different heights to make the sky look more natural. Although there weren’t any advanced graphics, enemies or platforms, I loved how simple and easy the game is for people of all ages.
*/


var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting; 

var speed;
var offset;

var trees_x;
var clouds;
var mountains;
var canyons;
var collectable;


var game_score;
var flagpole;
var lives;
var isNewLevel;

var jumpSound;
var collectSound;
var gameOverSound;
var gameWonSound;
var fallingSound;

var gameOverplayed;

function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
    collectSound = loadSound('assets/collect coins.wav');
    collectSound.setVolume(0.4);
    fallingSound = loadSound('assets/falling.wav');
    fallingSound.setVolume(0.04);
    gameWonSound = loadSound('assets/game won.wav')
    gameWonSound.setVolume(0.1);
    gameOverSound = loadSound('assets/game over.wav')
    gameOverSound.setVolume(0.1);
    
    //track whether or not sound has been played so we can prevent it from repeating in draw function
    gameOverplayed = false;
}


function setup()
{
	createCanvas(1024, 576);
    floorPos_y = height * 3/4;
    lives = 3;
    startGame();
}


function startGame()
{
    gameChar_x = width/2;
    gameChar_y = floorPos_y;
     
    gameOffset = { start: 300};
    
// Variable to control the background scrolling.
	scrollPos = 0;
    
	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
    isGameOver = false;
    
    
    speed = 8;
    offset = 10;

	// Initialise arrays of scenery objects.
    
     trees_x=   [200,850,1300,1950,2500,3300];
    
    
    
     clouds=    [    
                  {x:100,y:100,size:60},
                  {x:450,y:80,size:60},
                  {x:800,y:50,size:60},
                  {x:1150,y:80,size:60},
                  {x:1500,y:100,size:60},
                  {x:1850,y:80,size:60},
                  {x:2200,y:50,size:60},
                  {x:2550,y:80,size:60},
                  {x:2900,y:100,size:60},
                  {x:3250,y:80,size:60},
                  {x:3600,y:50,size:60},
                 
                ];
    
     mountains= [    
                   {x:350,y:floorPos_y,size:1}, 
                   {x:1100,y:floorPos_y,size:1},  
                   {x:1450,y:floorPos_y,size:1},   
                   {x:2200,y:floorPos_y,size:1}, 
                   {x:2650,y:floorPos_y,size:1},
                   {x:3500,y:floorPos_y,size:1},
        
                ];
    
    collectable=    [
                    {x: 300,y:  floorPos_y-10, size:20, isFound:false},
                    {x: 800,y:  floorPos_y-10,size:20, isFound:false},
                    {x: 1300,y: floorPos_y-10, size:20, isFound:false},
                    {x: 1500,y: floorPos_y-10, size:20, isFound:false},
                    {x: 1900,y: floorPos_y-10, size:20, isFound:false},
                    {x: 2200,y: floorPos_y-10, size:20, isFound:false},
                    {x: 2500,y: floorPos_y-10, size:20, isFound:false},
                    {x: 2800,y: floorPos_y-10, size:20, isFound:false},
                    {x: 3200,y: floorPos_y-10, size:20, isFound:false},
                    {x: 3600,y: floorPos_y-10, size:20, isFound:false},
                    ];
    
     canyons=  [
              
                   {x:-10,y:floorPos_y, width:70, height:200},
                   {x:600,y:floorPos_y,width:70, height:200},
                   {x:1680,y:floorPos_y,width:70, height:200},
                   {x:3000,y:floorPos_y,width:70, height:200},
                  
                
                
               ];

      
    
    game_score = 0;
    flagpole = {isReached: false, x: 3700}
    
}
    
function draw()
{
	background(100, 155, 255); // fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground
    
    fill(255);
    noStroke();
    textSize(16);
    textStyle(BOLD);
    text("Score : " + game_score , 20 , 20);

    renderLives();
    
    // Save the Current Style Settings
    push();
    translate(scrollPos , 0);
    
    // Draw clouds.
    drawClouds();

	// Draw mountains.
    drawMountains();

	// Draw trees.
     drawTrees()
    
 //Draw canyons.
for( var i = 0; i < canyons.length; i++)
    {
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);
    }


// Draw collectable items.
 for(var j = 0; j < collectable.length; j++)
{ 
    
    if(collectable[j].isFound == false)
       {
        drawCollectable(collectable[j]);
        checkCollectable(collectable[j]);   
       }
              
}
   
 renderFlagpole();
    
    if(!flagpole.isReached)
   {
     checkFlagpole();
   }
    
    checkPlayerDie();
    
//Restoring the current drawing style settings and transformations before the drawing the game character
pop();
    
    
   if(flagpole.isReached)
   {
      displayText("Level Complete.Press Space To Continue.")
      gameWonSound.play();   
       
   }

    // Draw game character.
 drawGameChar();
    
// Logic to make the game character move or the background scroll.
if(isLeft == true && isPlummeting== false)
{ 
    //  gameChar_x -= speed;

if (gameChar_x > width * 0.2)
{
    gameChar_x -= speed;
}
else
{
    scrollPos += speed;
    //Avoid Infinite negative scroll, start of level
    if(scrollPos > gameOffset.start)
    {
       scrollPos = gameOffset.start; 
    }
}
    
} else if( isRight == true && isPlummeting == false)
{
   if(gameChar_x < width * 0.8) 
    {
        gameChar_x += speed;
    }
    else
    {
       scrollPos -= speed; // negative for moving against background 
    }
}

	// Logic to make the game character rise and fall.
    if ( isFalling || isPlummeting)
    { 
        gameChar_y += speed /2;
        
        if(isPlummeting == false)
        { 
            if(gameChar_y >= floorPos_y)
            {
               gameChar_y = floorPos_y;
               isFalling = false;    
            }
        }
    }

  if(isGameOver)
  {
    displayText("Game Over. Press Spacebar to Continue.")
    gameOverSound.play();  
  }
	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

}

// ---------------------
// Key control functions
// ---------------------

function keyPressed()
{
//    console.log("keyPressed: " + key);
//    console.log("keyPressed: " + keyCode);
    
    if(keyCode == 37)
       { 
           isLeft=true;
       }
    
     else if(keyCode == 39) 
       { 
           isRight=true;
       }
      else if(keyCode == 32)
       {  
          if(!isGameOver && !flagpole.isReached)
           {
              if (gameChar_y == floorPos_y)
              { 
                  gameChar_y -= 100;
                  isFalling = true;
                  jumpSound.play();
//               
             }
          }
    else
     {
        lives = 3;
        startGame();
     }
   }
 }

function keyReleased()
{   
//    console.log("keyReleased: " + key);
//    console.log("keyReleased: " + keyCode);
        if(keyCode == 37) 
       {  
           isLeft= false;
       }
    
        else if(keyCode == 39) 
       {  
            isRight=false;
       }
    
}
// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	if(isLeft && isFalling)
	{
    // add your jumping-left code
    fill(0);
    stroke(0);
    ellipse(gameChar_x, gameChar_y -55 , 20 , 20);
    rect(gameChar_x -6, gameChar_y -45 , 12 , 30);
    
    line(gameChar_x -6, gameChar_y -45, gameChar_x -15, gameChar_y -65);
    line(gameChar_x +6, gameChar_y -45, gameChar_x +15, gameChar_y -65); 
        
    line(gameChar_x -5, gameChar_y -15, gameChar_x -10, gameChar_y); 
    line(gameChar_x -10, gameChar_y, gameChar_x -12, gameChar_y); 
    
    line(gameChar_x +5, gameChar_y -15, gameChar_x +10, gameChar_y); 
    line(gameChar_x +10, gameChar_y , gameChar_x +8, gameChar_y);     
	}
    
	else if(isRight && isFalling)
	{
    // add your jumping-right code
    fill(0);
    stroke(0);
    ellipse(gameChar_x, gameChar_y -55 , 20 , 20);
    rect(gameChar_x -6, gameChar_y -45 , 12 , 30);
    
    line(gameChar_x -6, gameChar_y -45, gameChar_x -15, gameChar_y -65);
    line(gameChar_x +6, gameChar_y -45, gameChar_x +15, gameChar_y -65); 
        
    line(gameChar_x -5, gameChar_y -15, gameChar_x -10, gameChar_y); 
    line(gameChar_x -10, gameChar_y, gameChar_x -8, gameChar_y); 
    
    line(gameChar_x +5, gameChar_y -15, gameChar_x +10, gameChar_y); 
    line(gameChar_x +10, gameChar_y , gameChar_x +12, gameChar_y); 
    }
    
    else if(isLeft)
	{
    // add your walking left code
    fill(0);
    stroke(0);
    ellipse(gameChar_x, gameChar_y -55 , 20 , 20);
    rect(gameChar_x -6, gameChar_y -45 , 12 , 30);
    
    line(gameChar_x -6, gameChar_y -45, gameChar_x -10, gameChar_y -25);
    line(gameChar_x +6, gameChar_y -45, gameChar_x +10, gameChar_y -25); 
        
    line(gameChar_x -5, gameChar_y -15, gameChar_x -5, gameChar_y); 
    line(gameChar_x -5, gameChar_y, gameChar_x -7, gameChar_y); 
    
    line(gameChar_x +5, gameChar_y -15, gameChar_x +5, gameChar_y); 
    line(gameChar_x +5, gameChar_y , gameChar_x +3, gameChar_y); 
	}
    
	else if(isRight)
	{
    // add your walking right code
    fill(0);
    stroke(0);
    ellipse(gameChar_x, gameChar_y -55 , 20 , 20);
    rect(gameChar_x -6, gameChar_y -45 , 12 , 30);
    
    line(gameChar_x -6, gameChar_y -45, gameChar_x -10, gameChar_y -25);
    line(gameChar_x +6, gameChar_y -45, gameChar_x +10, gameChar_y -25); 
        
    line(gameChar_x -5, gameChar_y -15, gameChar_x -5, gameChar_y); 
    line(gameChar_x -5, gameChar_y, gameChar_x -3, gameChar_y); 
    
    line(gameChar_x +5, gameChar_y -15, gameChar_x +5, gameChar_y); 
    line(gameChar_x +5, gameChar_y , gameChar_x +7, gameChar_y); 
	}
	else if(isFalling || isPlummeting)
	{
    // add your jumping facing forwards code
    fill(0);
    stroke(0);
    ellipse(gameChar_x, gameChar_y -55 , 20 , 20);
    rect(gameChar_x -12, gameChar_y -45 , 24, 30);
    
    line(gameChar_x -12, gameChar_y -45, gameChar_x -20, gameChar_y -65);
    line(gameChar_x +12, gameChar_y -45, gameChar_x +20, gameChar_y -65); 
        
    line(gameChar_x -5, gameChar_y -15, gameChar_x -15, gameChar_y); 
    line(gameChar_x -15, gameChar_y, gameChar_x -17, gameChar_y); 
    
    line(gameChar_x +5, gameChar_y -15, gameChar_x +15, gameChar_y); 
    line(gameChar_x +15, gameChar_y , gameChar_x +17, gameChar_y); 
    }
	else
	{
     // add your standing front facing code
    fill(0);
    stroke(0);
    ellipse(gameChar_x, gameChar_y -55 , 20 , 20);
    rect(gameChar_x -12 , gameChar_y -45 , 24 , 30);
    
    line(gameChar_x -12, gameChar_y -45, gameChar_x -15, gameChar_y -20);
    line(gameChar_x +12, gameChar_y -45, gameChar_x +15, gameChar_y -20); 
        
    line(gameChar_x -5, gameChar_y -15, gameChar_x -5, gameChar_y); 
    line(gameChar_x -5, gameChar_y, gameChar_x -7, gameChar_y); 
    
    line(gameChar_x +5, gameChar_y -15, gameChar_x +5, gameChar_y); 
    line(gameChar_x +5, gameChar_y , gameChar_x +7, gameChar_y); 
	}

}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds()
{
for(var i = 0; i < clouds.length; i++) 
    {
    fill(255,255,255);
    ellipse(clouds[i].x-40,clouds[i].y,clouds[i].size,clouds[i].size);
    ellipse(clouds[i].x,clouds[i].y,clouds[i].size +20,clouds[i].size+20);
    ellipse(clouds[i].x +40,clouds[i].y,clouds[i].size,clouds[i].size);
    }
}
// Function to draw mountains objects.
function drawMountains()
{
    for(var i = 0; i <mountains.length; i++)
   {
         //Draw a Mountain on Right Side
       
         fill(0,102,0);
         triangle(
                  mountains[i].x -150,
                  mountains[i].y,
                  mountains[i].size * (mountains[i].x),
                  mountains[i].size * (mountains[i].y -282),
                  mountains[i].size * (mountains[i].x +50),
                  mountains[i].y
                 );
         fill(102,204,0);
         triangle(
                  mountains[i].size * (mountains[i].x +50),
                  mountains[i].y,
                  mountains[i].size * (mountains[i].x),
                  mountains[i].size * (mountains[i].y -282),
                  mountains[i].size * (mountains[i].x +150),
                  mountains[i].y
                 );
        stroke(126);
        line(
                  mountains[i].size * (mountains[i].x),
                  mountains[i].size * (mountains[i].y -282),
                  mountains[i].size * (mountains[i].x +50),
                  mountains[i].y
           );
         noStroke();
       
       //Draw a Mountain on Left Side
       
       fill(0,102,0);
         triangle(
                  mountains[i].x -200,
                  mountains[i].y,
                  mountains[i].size * (mountains[i].x -100),
                  mountains[i].size * (mountains[i].y -182),
                  mountains[i].size * (mountains[i].x -50),
                  mountains[i].y
                 );
         fill(102,204,0);
         triangle(
                  mountains[i].size * (mountains[i].x -50),
                  mountains[i].y,
                  mountains[i].size * (mountains[i].x -100),
                  mountains[i].size * (mountains[i].y -182),
                  mountains[i].size * (mountains[i].x -50),
                  mountains[i].y
                 );
        stroke(126);
        line(
                  mountains[i].size * (mountains[i].x -100),
                  mountains[i].size * (mountains[i].y -182),
                  mountains[i].size * (mountains[i].x -50),
                  mountains[i].y
           );
         noStroke();
         fill(255);
   }
}

// Function to draw trees objects.
function drawTrees()
 { 
    for(var i = 0; i < trees_x.length; i++)
   { //trunk
    noStroke();
    fill(112,100,50);
    //Leaving the anchor
    rect(trees_x[i], height/2+95, 25,50)
    //bushes
    stroke(43,105,41);
    fill(43,105,41);
    triangle(trees_x[i] -45, height/2+25, trees_x[i] +70, height/2+25, trees_x[i] +12, height/2-50);   
    triangle(trees_x[i] -45, height/2+60, trees_x[i] +70, height/2+60, trees_x[i] +12, height/2-15);
    triangle(trees_x[i] -45, height/2+95, trees_x[i] +70, height/2+95, trees_x[i] +12, height/2+20);
    //shadows
    fill(40,80,80);
    noStroke();
    triangle(trees_x[i] -45, height/2+25, trees_x[i] +70, height/2+25, trees_x[i] +12, height/2-50);   
    triangle(trees_x[i] -50, height/2+60, trees_x[i] +72, height/2+60, trees_x[i] +12, height/2-15);
    triangle(trees_x[i] -50, height/2+95, trees_x[i] +72, height/2+95, trees_x[i] +12, height/2+20);  
  }
    
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
   fill(150,75,34);
   beginShape();
   vertex(t_canyon.x, t_canyon.y);
   vertex(t_canyon.x - t_canyon.width, t_canyon.y + 30);
   vertex(t_canyon.x - t_canyon.width, t_canyon.y + t_canyon.height);
   vertex(t_canyon.x, t_canyon.y + t_canyon.height);
   vertex(t_canyon.x , t_canyon.y);    
   endShape(CLOSE);

   fill(100,155,255);
   rect(t_canyon.x, t_canyon.y , t_canyon.width, t_canyon.height);
    
   //water
   fill(0,0,255,150);
   rect(t_canyon.x, t_canyon + t_canyon.height/2, t_canyon.width, t_canyon.height) 
   beginShape();
   vertex(t_canyon.x, t_canyon.y + t_canyon.height/2);
   vertex(t_canyon.x - t_canyon.width, t_canyon.y + t_canyon.height/2+30);
   vertex(t_canyon.x - t_canyon.width, t_canyon.y + t_canyon.height);
   vertex(t_canyon.x, t_canyon.y + t_canyon.height);
   vertex(t_canyon.x , t_canyon.y);    
   endShape(CLOSE); 
    
   fill(100,155,255);
    triangle(t_canyon.x + t_canyon.width , t_canyon.y, t_canyon.x +t_canyon.width, t_canyon.y +30, t_canyon.x + t_canyon.width*2 , t_canyon.y);

    
}
// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
   if( gameChar_world_x > t_canyon.x + offset && gameChar_world_x + offset < t_canyon.x + t_canyon.width *2 )
 
        {
           if( gameChar_y >= floorPos_y)
           { 
               isPlummeting = true;
               fallingSound.play();
           }
     
       else
        {
            
        }
    }
}
    

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
        fill(255,255,0);
        ellipse(t_collectable.x+20,floorPos_y-15, 50, 50);
        fill(0,0,0);
        textSize(27);
        text("$",t_collectable.x+14,floorPos_y-7);
}
//
// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
      if(dist(gameChar_world_x, gameChar_y, t_collectable.x, t_collectable.y) < 20 )
          
         {                        
          t_collectable.isFound = true;
          game_score ++;
          collectSound.play();     
         }
}
    
//----------------------------------
// Flagpole render and check functions
// ----------------------------------

// Function to render a flagpole
    
function renderFlagpole()
{
  strokeWeight(5);
  stroke(100);
  line(flagpole.x,floorPos_y,flagpole.x, floorPos_y - 150);
  fill(255,255,255);
  noStroke(); 
   
  var flagY
  if(flagpole.isReached)
    {
        flagY = 150
    }
    
    else
    {
        flagY =40
    }
    
    triangle( flagpole.x +3, floorPos_y - flagY, flagpole.x+50, floorPos_y-(flagY -20) , flagpole.x +3 , floorPos_y -(flagY -40))
}

    function checkFlagpole()
    {
        var dist = abs(gameChar_world_x - flagpole.x);
        
        if(dist <= 20)
        {
        flagpole.isReached = true;
        }
    }
    
    function renderLives()
    {
        var heartSize = 20;
        var y =20;
        for (var j =0; j < lives; j++)
        {
          beginShape();
          fill(255,0,0);
          var x = width -20 - (j*(heartSize + 10));    
          vertex(x,y);
          bezierVertex ( x - heartSize /2, y - heartSize / 2, x - heartSize, y + heartSize / 3 , x , y + heartSize);
          bezierVertex ( x + heartSize, y + heartSize / 3, x + heartSize / 2, y - heartSize / 2 , x , y );
          endShape(CLOSE);    
        }
    }
 

 function renderLives()
 { 
      var heartSize = 20;
      var y = 20;
      for(var j = 0; j < lives; j++)
      {
          beginShape();
          fill(255,0,0);
          var x = width -20 - (j*(heartSize + 10));    
          vertex(x,y);
          bezierVertex ( x - heartSize /2, y - heartSize / 2, x - heartSize, y + heartSize / 3 , x , y + heartSize);
          bezierVertex ( x + heartSize, y + heartSize / 3, x + heartSize / 2, y - heartSize / 2 , x , y );
          endShape(CLOSE);  
      }

 }
    function checkPlayerDie()
   {
     if (gameChar_y > height && lives > 0)
         {
             lives --;
              
             if(lives > 0)
             {   
                startGame();     
            }
         else
         {
           lives = 0;
           isGameOver = true;    
         }
     }
}
    
function displayText(textValue)
{
  fill(0);
  textAlign(CENTER);   
  stroke(3);
  textSize(34);
  textStyle(BOLD);
  text(textValue, width /2, height/2);
    
  fill(255,255,255);
  stroke(3);
  textSize(10);
  text("Press Space To Continue", width /2 , height/ 2+100);
    
  textAlign(LEFT);    
}

