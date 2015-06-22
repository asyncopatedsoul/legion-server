// pathing.js

var curve = new Bezier(150,40 , 80,30 , 105,150);
var arclength = curve.length();
console.log("length",arclength);

var steps = Math.floor(arclength/5);
var LUT = curve.getLUT(steps);

var segments = [];
var totalSegmentLength = 0;

_.each(LUT, function(point,idx){
  console.log("LUT",idx,point);

  if (idx<LUT.length-1) {
    var pointA = point;
    var pointB = LUT[idx+1];
    var segmentLength = Math.sqrt( Math.pow(pointA.x-pointB.x,2) + Math.pow(pointA.y-pointB.y,2) );
    console.log("length",segmentLength);

    var segment = {a:pointA, b:pointB, length:segmentLength};

    segments.push(segment);
    totalSegmentLength+=segmentLength;
  }
});

console.log("totalSegmentLength",totalSegmentLength);

// segments must be contiguous
// enpoints must fall on segments
var Path = function(endpointA, endpointB, segments) {
  this.endpointA = endpointA;
  this.endpointB = endpointB;
  this.segments = segments;
};

Path.prototype = {

  getDistanceToEnpoint: function() {

  },

  getClosestPointToEndpoints: function (point1, point2) {



  }, 

  

  getTweenPointsAlongPathForSpeed: function (speed, tweenInterval, startPoint) {

  // given a unit's speed and tween interval,
  // what are all the tween points along the path?
  // tweenInterval in ms
  // speed in map units per second
  // startPoint is endpointA or endpointB of Path

  // returns array of map coordinates

    var tweenPositions = [];

    if (startPoint!==this.endpointA && startPoint!==this.endpointB) {
      return new Error("startPoint must be an endpoint of this Path");
    }

    tweenPositions.push(startPoint);

    var distanceTraveledPerTween = speed * tweenInterval;
    var segmentIndex = 0;

    // if segment is less than remaining distance 
    // subtract segments from distance 
    // until remaining distance is less than current segment

    do {

      var distanceTraveled = distanceTraveledPerTween;

      while (distanceTraveled > this.segments[segmentIndex]) {
        distanceTraveled = distanceTraveled - this.segments[segmentIndex].length; 
        segmentIndex++;
      }

      console.log("distance remaining:", totalDistance);
      console.log("segment index:",segmentIndex);

      // find point at distance along segment
      var nextTweenPosition = this.getPointAtDistanceAlongSegment(distanceTraveled);
      
      tweenPositions.push(nextTweenPosition);

    } while (segmentIndex<this.segments.length-1)
    // continue to calculate positions until at final segment
    
    var endPoint = (startPoint==this.endpointA) ? this.endpointB : endpointA;

    tweenPositions.push(endPoint);


    return tweenPositions;
  },

  // how to determine which point of the segment is the origin?
  // the origin is the point closese to the origin of the path
  getPointAtDistanceAlongSegment: function (distance, segmentIndex) {

    var currentSegment = this.segments[segmentIndex];
    var targetOrigin = this.getClosestPointToEndpoints();

    // with current segment
    // get point at distance along line
    // y - y1 = m(x - x1)

    var slope = (segment.a.y - segment.b.y) / (segment.a.x - segment.b.x);

    // which point is higher?
    var originLow = (segment.a.y>segment.b.y) ? segment.b : segment.a;
    var originHigh = (segment.a.y>segment.b.y) ? segment.a : segment.b;

    // y = slope * x;

    // angle = arctan (slope)
    var angle = Math.atan(slope);

    // distance = hypotenuse
    // if slope is positive

    // opposite = y 
    // tan angle = y / distance
    // y = distance * tan angle
    var deltaY = totalDistance * Math.tan(angle);

    // adjacent = x
    // cos angle = x / distance
    // x = distance * cos angle
    var deltaX = totalDistance * Math.cos(angle);

    var pointAlongPath = {};

  }
};

var Unit = function(config) {
  this.speed = config.speed;
  this.position = config.position || { x:0, y:0 };
  this.rallyPoint = null;

}

Unit.prototype = {

};