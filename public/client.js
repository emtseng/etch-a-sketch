var radius = 3;           // Constant radio for the line
var socket = io();        // websocket to the server
var previousPosition = [0, 0]; // previous position to draw a line from
var ctx = Sketch.create({
  container: document.getElementById('container'),
  autoclear: false,
  retina: 'auto',
}); //Creating the drawing context
var firstMessage = true;    // What the first message, to start on the first value
ctx.setup = function () { console.log('setup'); } // Setup all variables
ctx.keydown = function () { if (ctx.keys.C) ctx.clear(); } // handeling keydowns

socket.on('reset', function () { // on a 'reset' message clean and reset firstMessage
  firstMessage = true;
  ctx.clear();
});

var COLOUR = '#505050';  // This is the drawing color

var colors = {
  'red': '#fc0d1c',
  'green': '#0e7e12',
  'blue': '#0b24fb',
  'black': '#505050'
}


socket.on('new-pos', function (newPosition) { // handling new sensor values
  //Map values to height and width of screen, accounting for desired padding
  var start_x = 0
    , end_x = ctx.width * (0.9)
    , start_y = 0
    , end_y = ctx.height * (0.8);

  newPosition[0] = map(newPosition[0], 0, 1023, start_x, end_x)
  newPosition[1] = map(newPosition[1], 0, 1023, start_y, end_y)

  if (firstMessage) { // if its the first message store that value as previous
    firstMessage = false;
    previousPosition = newPosition;
  } else { // any other message we use to draw.
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = ctx.strokeStyle = COLOUR;
    ctx.lineWidth = radius;
    ctx.beginPath();  //begin a drawing
    ctx.moveTo(previousPosition[0], previousPosition[1]); // from
    ctx.lineTo(newPosition[0], newPosition[1]); // to
    ctx.stroke(); // and only draw a stroke
    previousPosition = newPosition; // update to the new position.
  }
});

$('button').hover(function() {
  $(this).addClass('zoom')
}, function() {
  $(this).removeClass('zoom')
})

$('button').click(function() {
  $('button.selected').removeClass('selected')
  $(this).addClass('selected')
  COLOUR = $(this).attr('id')
})
