// set up global variables
var canvas;
var canvasContext;
var ballX = 50;
var ballSpeedX = 5;
var ballY = 50;
var ballSpeedY = 4;
var ballY = 50;
var fps = 30;

var paddleHeight = 100;
var paddleWidth = 10;

// set up canvas
canvas = document.getElementById('gameCanvas');
canvasContext = canvas.getContext('2d');

//draw everything
function drawEverything() {
  // draw canvas
  colorRect(0,0,canvas.width,canvas.height,'black');
  
  // draw ball
  drawCircle(ballX,ballY,10,'white');
  
  // draw paddle 1
  colorRect(10,10,paddleWidth,paddleHeight,'white');
}

// helper functions
// draw shape
function colorRect(leftX,topY,width,height,fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.fillRect(leftX,topY,width,height); 
}

// draw  cirlce
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

// move everything
function moveEverything() {
  // ballX
  ballX += ballSpeedX;
  
  if (ballX > canvas.width) {
    ballSpeedX = -ballSpeedX;
  } else if (ballX < 0) {
    ballSpeedX = -ballSpeedX;
  }
  
  // ballY
  ballY += ballSpeedY;
  
  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  } else if (ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }
}

// call draw and move functions
setInterval(function() {
  drawEverything();
  moveEverything();
}, 1000/fps);