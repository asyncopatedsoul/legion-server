if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });

  Template.draw.rendered = function(){
    if (!this.rendered) {

    console.log("HELLO FROM RENDERED");

    var canvas, ctx, w, h,
        world, circleBody, planeBody;

    init();
    animate();

    function init(){

      // Init canvas
      canvas = document.getElementById("myCanvas");
      w = canvas.width;
      h = canvas.height;

      ctx = canvas.getContext("2d");
      ctx.lineWidth = 0.05;

      // Init p2.js
      world = new p2.World();

      // Add a circle
      circleShape = new p2.Circle({ radius: 1 });
      circleBody = new p2.Body({ mass:1, position:[0,3] });
      circleBody.addShape(circleShape);
      world.addBody(circleBody);

      // Add a plane
      planeShape = new p2.Plane();
      planeBody = new p2.Body();
      planeBody.addShape(planeShape);
      world.addBody(planeBody);
    }

    function drawCircle(){
      ctx.beginPath();
      var x = circleBody.position[0],
          y = circleBody.position[1],
          radius = circleShape.radius;
      ctx.arc(x,y,radius,0,2*Math.PI);
      ctx.stroke();
    }

    function drawPlane(){
      var y = planeBody.position[1];
      ctx.moveTo(-w, y);
      ctx.lineTo( w, y);
      ctx.stroke();
    }

    function render(){
      // Clear the canvas
      ctx.clearRect(0,0,w,h);

      // Transform the canvas
      // Note that we need to flip the y axis since Canvas pixel coordinates
      // goes from top to bottom, while physics does the opposite.
      ctx.save();
      ctx.translate(w/2, h/2);  // Translate to the center
      ctx.scale(50, -50);       // Zoom in and flip y axis

      // Draw all bodies
      drawCircle();
      drawPlane();

      // Restore transform
      ctx.restore();
    }

    // Animation loop
    function animate(){
      requestAnimationFrame(animate);

      // Move physics bodies forward in time
      world.step(1/60);

      // Render scene
      render();
    }
    this.rendered = true;
  }
  };
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
