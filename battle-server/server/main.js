//constants
var counter = 0;
var totalSteps = 100;  //100 steps per path default
var collided = false;
var timeStep = 1000 * 1 / 60; //updateLoop is ran every 'timeStep' milliseconds

//plan path
var playerStart = new Point(10,10), playerEnd = new Point(50,40), controlPointA = new Point(20,70);
//var curve = new BezierCurve(playerStart,controlPointA,playerEnd);

var playerManeuver = {
  "name":"Drunk Donkey",
  "radius":1,
  "startPosition": new Point(10,10),
  "endPosition": new Point(50, 40),
  "controlPointA": new Point(20, 70)
};
var maneuverPath = new BezierCurve(playerManeuver.startPosition, playerManeuver.controlPointA, playerManeuver.endPosition);


var somethings = [
  {
    "name":"Fred Durst",
    "radius":2,
    "position": [15, 50]
  },
  {
    "name":"Tyler Perry",
    "radius":5,
    "position": [5, 30]
  },
  {
    "name":"Big Momma",
    "radius":20,
    "position": [28, 35]
  },
  {
    "name":"Batman",
    "radius":1,
    "position": [30, 59]
  }
];

//load the world
var world = new p2.World({
  gravity: [0,0]
});

//load the player
var playerBody = new p2.Body({
  mass:1,
  position: [playerManeuver.startPosition.x, playerManeuver.startPosition.y]
});

var playerShape = new p2.Circle({radius: playerManeuver.radius});
playerBody.addShape(playerShape);
world.addBody(playerBody);

//add collision detection event
world.on("beginContact", function(e) {
  console.log("Collision detected");
  collided = true;
});

//load all somethings that player can interact with
for (var i = 0; i < somethings.length; i++) {
  var somethingBody = new p2.Body({
    mass: 0,
    position: somethings[i].position
  });
  var somethingShape = new p2.Circle({radius: somethings[i].radius});
  somethingBody.addShape(somethingShape);
  world.addBody(somethingBody);
}

//checking iteration loop
var checkLoop = setInterval(function(){
  var location = maneuverPath.compute(counter / totalSteps);
  var derivative = maneuverPath.getDerivative(counter / totalSteps);
  counter++;

 //lol I'm such a hacker xD
  playerBody.position = location;

  playerBody.velocity[0] = derivative.x / totalSteps;
  playerBody.velocity[1] = derivative.y / totalSteps;

  // The step method moves the bodies forward in time.
  //required for physics collision
  world.step(timeStep);

  collided ? breakOut(this, true) : {};
  counter > totalSteps ? breakOut(this, false) : {};
}, timeStep);  //time in milliseconds

//breaks out of the CheckLoop
var breakOut = function(loop, didCollide){
  clearInterval(loop);
  collided = didCollide;
  console.log("collided: ", collided, "on counter: ", counter);
  counter = 0;
}


// DEFINE RALLY POINTS

// CREATE CARDS

// DEPLOY CARD AT RALLY POINT

// SPAWN UNITS

// UNIT MOVES

// UNIT REACHES RALLY POINT, HQ

// UNIT REMOVED FROM MAP

// ENEMY HQ REDUCED
