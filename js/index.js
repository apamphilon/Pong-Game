// set up global variables
var canvas;
var canvasContext;
var ballX = 50;
var ballSpeedX = 5;
var ballY = 50;
var ballSpeedY = 4;
var fps = 60;
const BALL_DEFLECTION_AMOUNT = 0.20;
var aiDifficulty = 6;

// paddles
var paddle1Y = 250;
var paddle2Y = 250;

// score
var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;
var showWinningScreen = false;

const PADDLE_HEIGHT = 100; // using a naming convention from c# to seperate const from var
const PADDLE_WIDTH = 10;


// calculate mouse position
function calcMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x:mouseX,
    y:mouseY,
  };
}

// mouse click
function handleMouseClick() {
  if (showWinningScreen) {
    player1Score = 0;
    player2Score = 0;
    showWinningScreen = false;
  }
}

window.onload = function() {
  // set up canvas
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  canvas.addEventListener('mousedown', handleMouseClick);

  // draw net
  function drawNet() {
    for(var i=10; i<canvas.height; i+=40) {
      colorRect(canvas.width/2-1,i,2,20,'white');
    }
  }

  //draw everything
  function drawEverything() {
    // draw canvas
    colorRect(0,0,canvas.width,canvas.height,'black');

    if (showWinningScreen) {
      canvasContext.fillStyle = 'white';
      if (player1Score >=  WINNING_SCORE) {
        canvasContext.fillText('Player one wins!', 350, 100);
      } else if (player2Score >= WINNING_SCORE) {
        canvasContext.fillText('Player two wins!', 350, 100);
      }
      canvasContext.fillText('click to continue', 350, 500);
      return;
    }

    // draw net
    drawNet();

    // draw ball
    drawCircle(ballX,ballY,10,'white');

    // draw paddle 1
    colorRect(0,paddle1Y,PADDLE_WIDTH,PADDLE_HEIGHT,'white');

    // draw paddle 2
    colorRect(canvas.width-PADDLE_WIDTH,paddle2Y,PADDLE_WIDTH,PADDLE_HEIGHT,'white');

    // draw text
    canvasContext.fillText(player1Score, 100, 100);
    canvasContext.fillText(player2Score, canvas.width-100, 100);
  }

  // helper functions
  // draw shape
  function colorRect(leftX,topY,width,height,fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillRect(leftX,topY,width,height);
  }

  // draw cirlce
  function drawCircle(centerX,centerY,radius,circleColor) {
    canvasContext.fillStyle = circleColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX,centerY,radius,0,Math.PI*2,true);
    canvasContext.fill();
  }

  // mouse position
  function calcMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;

    // return values
    return {
      x:mouseX,
      y:mouseY
    }
  }

  // reset ball
  function ballReset() {
    if (player1Score >=  WINNING_SCORE || player2Score >= WINNING_SCORE) {
      showWinningScreen = true;
    }

    // reset ball to center of canvas
    ballX = canvas.width/2;
    ballY = canvas.height/2;

    // reverse ball direction
    ballSpeedX =- ballSpeedX;

    // reset ballSpeedY
    ballSpeedY = 4;
  }

  function computerAi() {
    var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
    if (paddle2YCenter < ballY-35) {
      paddle2Y += aiDifficulty;
    } else if (paddle2Y > ballY+35) {
      paddle2Y -= aiDifficulty;
    }
  }

  // move everything
  function moveEverything() {
    if (showWinningScreen) {
      return;
    }

    computerAi(); // init

    // ballX
    ballX += ballSpeedX;

    // ballY
    ballY += ballSpeedY;

    if (ballY > canvas.height) {
      ballSpeedY = -ballSpeedY;
    } else if (ballY < 0) {
      ballSpeedY = -ballSpeedY;
    }

    // if ball travels off canvas to the left
    if (ballX < 0) {
      if (ballY > paddle1Y && ballY < paddle1Y+PADDLE_HEIGHT) {
        ballSpeedX =- ballSpeedX;

        var deltaY = ballY - (paddle1Y+PADDLE_HEIGHT/2);
        ballSpeedY = deltaY * BALL_DEFLECTION_AMOUNT ;
      } else {
        player2Score++; // must be before ballReset()
        ballReset();
      }
    }

    // if ball travels off canvas to the right
    if (ballX > canvas.width) {
      if (ballY > paddle2Y && ballY < paddle2Y+PADDLE_HEIGHT) {
        ballSpeedX =- ballSpeedX;

        var deltaY = ballY - (paddle2Y+PADDLE_HEIGHT/2);
        ballSpeedY = deltaY * BALL_DEFLECTION_AMOUNT ;
      } else {
        player1Score++; // must be before ballReset()
        ballReset();
      }
    }
  }

  // call draw and move functions
  setInterval(function() {
    drawEverything();
    moveEverything();
  }, 1000/fps);

  canvas.addEventListener('mousemove', function(evt) {
    var mousePos = calcMousePos(evt);
    paddle1Y = mousePos.y-(PADDLE_HEIGHT/2);
  });
}
