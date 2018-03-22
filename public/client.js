var COLOUR = '#505050';  // This is the drawing color
var radius = 3;           // Constant radio for the line
var socket = io();        // websocket to the server
var previousPosition = [0, 0]; // previous position to draw a line from
var ctx = Sketch.create(); //Creating the drawing context
var firstMessage = true;    // What the first message, to start on the first value

ctx.container = document.getElementById('container'); //reference drawing canvas
ctx.autoclear = false; // making sure it stays
ctx.retina = 'auto';
ctx.setup = function () { console.log('setup'); } // Setup all variables
ctx.keydown = function () { if (ctx.keys.C) ctx.clear(); } // handeling keydowns

socket.on('reset', function () { // on a 'reset' message clean and reste firstMessage
  firstMessage = true;
  ctx.clear();
});

function map(num, inputMin, inputMax, outputMin, outputMax) {
  return (num - inputMin) * (outputMax - outputMin) / (inputMax - inputMin) + outputMin;
}

socket.on('new-pos', function (newPosition) { // handling new sensor values
  print('before map: ', newPosition)
  //Map values to height and width of screen
  var start_x = ctx.width * 0.05
    , end_x = ctx.width - start_x
    , start_y = ctx.height * 0.05
    , end_y = ctx.height - start_y;

  newPosition[0] = map(newPosition[0], 0, 1023, start_x, end_x)
  newPosition[1] = map(newPosition[1], 0, 1023, start_y, end_y)

  console.log("after map: ", newPosition)

  if (firstMessage) { // if its the first message store that value as previous
    firstMessage = false;
    previousPosition = newPosition;
  } else { // any other message we use to draw.
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = ctx.strokeStyle = COLOUR;
    ctx.lineWidth = radius;
    ctx.beginPath();  //begin a adrawing
    ctx.moveTo(previousPosition[0], previousPosition[1]); // from
    ctx.lineTo(newPosition[0], newPosition[1]); // to
    ctx.stroke(); // and only draw a stroke
    previousPosition = newPosition; // update to the new position.
  }
});
