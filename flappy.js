console.log('Author: AD');

// Get Main Wrapper
let mainWrap = document.getElementById('main-wrapper');

// Define Game Wrapper
class GameWrapper {
  constructor(){
    this.element = document.createElement('div');
    this.element.style.width = '800px';
    this.element.style.height = '581px';
    this.element.style.background = "url('background.png')";
    this.element.style.backgroundPosition = '0px 0px';
    this.element.style.backgroundOpacity = '0.8';
    this.element.style.repeat = 'repeat-x';
    this.element.style.position = 'relative';
    this.element.style.overflow = 'hidden';
    mainWrap.appendChild(this.element);
  }

  // Move background
  move(){
    this.element.style.backgroundPosition = '-'+offset+'px 0px';
  }
}

// Reset Button
let resetButton = document.createElement('button');
resetButton.innerHTML = 'RESET';
resetButton.onclick = function(){
  window.location.reload();
};
mainWrap.appendChild(resetButton);

class Bird {
  constructor() {
    // Starting Position
    this.y = 290; this.x = 300;
    // Speed to fall down
    this.gravity = 3;
    // acceleration factor
    this.acceleration = 1;
    // frame count, for utilizing acceleration
    this.frame = 0;
    this.element = document.createElement('div');
    this.element.style.position = 'absolute';
    this.element.style.width = '50px';
    this.element.style.height = '50px';
    this.element.style.background = "url('./flappy.png')";
    this.element.style.top = '290px';
    this.element.style.left = '300px';
    gameWrap.element.appendChild(this.element);
  }

  // Move bird up and down
  move() {
    this.y += this.gravity;
    // don;t let the bird go out of bounds at the top
    if (this.y<0) {
      this.y = 0;
    }
    // if bird is going down, slowly apply acceleration, else no acceleration
    if (this.gravity > 0) {c
      this.y = this.y + Math.floor(this.acceleration*this.frame*0.1);
      this.frame++;
    }else {
      this.frame = 0;
    }
    this.element.style.top = this.y + 'px';
    // end game if bird touches the ground(lower limit)
    if (this.y+50 >= 581) {
      gameOver();
    }
  }
}

// Create Obstacle
class Obstacle {
  constructor(posy) {
    // start from rightmost position (out of view) and move towards left
    this.y = posy; this.x = 900;
    // top obstacle
    this.topelement = document.createElement('div');
    // bottom obstacle
    this.bottomelement = document.createElement('div');
    this.topelement.style.backgroundImage = "url('./top.png')";
    this.topelement.style.backgroundPosition = 'bottom';
    this.topelement.style.background = "url('./repeater.png')";
    this.topelement.style.backgroundRepeat = 'repeat-y';
    this.topelement.style.position = 'absolute';
    this.topelement.style.left = '900px';
    this.topelement.style.top = '0px';
    // set the bottom y coordinate of topelement as height
    this.topelement.style.height = this.y + 'px';
    this.topelement.style.width = '50px';
    this.bottomelement.style.backgroundImage = "url('./bottom.png')";
    this.bottomelement.style.backgroundPosition = 'top';
    this.bottomelement.style.background = "url('./repeater.png')";
    this.bottomelement.style.backgroundRepeat = 'repeat-y';
    this.bottomelement.style.position = 'absolute';
    this.bottomelement.style.left = '900px';
    // set the top y cordinate of bottomelement leaving the gap of
    // 150 px from the bottom y cordinate of the topelement
    this.bottomelement.style.top = this.y + 150 +'px';
    this.bottomelement.style.height = 581 - this.y - 150 + 'px';
    this.bottomelement.style.width = '50px';
    gameWrap.element.appendChild(this.topelement);
    gameWrap.element.appendChild(this.bottomelement);
  }

  // Move obstacle
  move(){
    this.x -= 2;
    this.topelement.style.left = this.x + 'px';
    this.bottomelement.style.left = this.x + 'px';
    // if it passes through the bird, increase score
    if (this.x == 248) {
      score++;
    }
    // if it goes out of bounds, kill it
    if (this.x <= -50) {
      this.kill();
    }
  }

  // kill obstacle
  kill(){
    gameWrap.element.removeChild(this.topelement);
    gameWrap.element.removeChild(this.bottomelement);
    allObstacles.splice(allObstacles.indexOf(this),1);
    delete this;
  }
}

// Check Collision
let checkCollision = (bird, obs) => {
  if (bird.y+50 >= 0 && bird.y <= obs.y && bird.x+50 >= obs.x && bird.x <= obs.x+50) {
    return 1;
  }else if (bird.y+50 >= obs.y+150 && bird.y <= obs.y+150+518-obs.y-150 && bird.x+50 >= obs.x && bird.x <= obs.x + 50) {
    return 1;
  }
  return 0;
}

// score
let score = 0;

// game world
let gameWrap = new GameWrapper();

// scoreboard
let scoreboard = document.createElement('div');
scoreboard.style.background = 'aqua';
scoreboard.style.width = '100px';
scoreboard.style.height = '20px';
scoreboard.style.textAlign = 'center';
scoreboard.style.position = 'absolute';
scoreboard.style.zIndex = 30;
scoreboard.style.top = '0px';
scoreboard.style.left = '0px';
scoreboard.innerHTML = '0';
gameWrap.element.appendChild(scoreboard);

// create bird
let bird = new Bird();

// store all obstacles, each obstacle has top and bottom elements
let allObstacles = [];

// offset to move background
let offset = 2;

// start moving and doing stuffs
let gameInterval = setInterval(() => {
  gameWrap.move();
  bird.move();
  allObstacles.forEach((obs) => {
    obs.move();
    if (checkCollision(bird, obs)){
      gameOver();
    }
  scoreboard.innerHTML = score;
  });
  offset += 2;
},10);

// Create new obstacles every 2 seconds
let obsInterval = setInterval(() => {
  // gapheight is the depth from the top of the gameworld where the gap should start
  let gapheight = Math.floor(Math.random()*200)+150;
  obst = new Obstacle(gapheight);
  allObstacles.push(obst);
},2000);


let gravityTimeout;
document.onkeydown = (event) => {
  // on pressing of space or up arrow
  if (event.keyCode == 38 || 32) {
    clearTimeout(gravityTimeout);
    // reset gravity
    bird.gravity = Math.abs(bird.gravity);
    // if bird is moving down, make it go up
    if (bird.gravity > 0) {
      bird.gravity *= -1;
    }
    // make bird go down again after 0.3 seconds
    gravityTimeout = setTimeout(setgravity => bird.gravity *= -1, 300);
  }
}

// stuff to do when game ends
gameOver = () => {
  clearInterval(gameInterval);
  clearInterval(obsInterval);
  document.onkeydown = null;
  let gyamover = document.createElement('div');
    gyamover.style.background = 'red';
    gyamover.style.width = '840px';
    gyamover.style.height= '150px';
    gyamover.style.position = 'relative';
    gyamover.style.left = '0%';
    gyamover.style.top = '30%';
    gyamover.style.textAlign = 'center';
    gyamover.style.fontSize = '50px';
    gyamover.innerHTML = 'GAME OVER <br> Your Score is: '+score;
    gameWrap.element.appendChild(gyamover);
}
