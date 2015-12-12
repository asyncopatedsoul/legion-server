
// pathing.js

Point = function(x,y) {
  //console.log("point: " + x + y);
  //this.vec = new b2Vec2(x, y);
  this.x = x;
  this.y = y;
};

Point.prototype = {
  getCoordinate: function(){
    return [this.x,this.y];
  },
  distanceFromPoint: function(point) {
    return Math.sqrt( Math.pow( (point.x-this.x), 2) + Math.pow( (point.y-this.y), 2) );
  },
  closestPointAmongPoints: function(points) {
    var pointsByDistance = _.sortBy(points,function(point){
      return this.distanceFromPoint(point);
    },this);

    return pointsByDistance[0];
  }
}

BezierCurve = function(endpointA, controlPoint, endpointB) {
  this._curve = new Bezier(endpointA.x,endpointA.y, controlPoint.x,controlPoint.y, endpointB.x,endpointB.y);
  //this._curve = new Bezier(endpointA, controlPoint, endpointB);
  this._arclength = this._curve.length();
  this.LUT = null;
}

BezierCurve.prototype = {

  getDerivative: function(pointInTime) {
    return this._curve.derivative(pointInTime);
  },

  getNormal: function(pointInTime) {
    return this._curve.normal(pointInTime);
  },

  compute: function(pointInTime) {
    return [this._curve.compute(pointInTime).x, this._curve.compute(pointInTime).y];
  },

  get: function(pointInTime) {
    return this._curve.compute(pointInTime);
  },

  flatten: function(averageUnitsPerSegment) {
    var steps = Math.floor(this._arclength/averageUnitsPerSegment);
    var LUT = this._curve.getLUT(steps);

    var segments = [];
    var totalSegmentLength = 0;

    _.each(LUT, function(point,idx){
      console.log("LUT",idx,point);

      if (idx<LUT.length-1) {
        var pointA = point;
        var pointB = LUT[idx+1];

        var segment = new Segment(pointA,pointB);

        segments.push(segment);
      }
    });

    this.LUT = LUT;

    return segments;
  }
}

Segment = function(endpointA, endpointB) {
  this.a = endpointA;
  this.b = endpointB;

  this.length = Math.sqrt( Math.pow(this.a.x-this.b.x,2) + Math.pow(this.a.y-this.b.y,2) );
  console.log("length",this.length);
};

// segments must be contiguous
// enpoints must fall on segments
Path = function(endpointA, endpointB, segments) {
  this.endpointA = endpointA;
  this.endpointB = endpointB;
  this.segments = segments;

  this.length = this._calculateLength();

  this.map = null;
};

Path.prototype = {

  _calculateLength:  function() {
    var sumLength = 0;

    _.each(this.segments,sumSegmentLength);

    return sumLength;

    function sumSegmentLength(segment) {
      sumLength+=segment.length;
    }
  },


  getTweenPoints: function (speed, tweenInterval, startPoint) {

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

    var distanceTraveledPerTween = speed * tweenInterval/1000;
    var segmentIndex = 0;
    var remainderDistanceAlongSegment = 0;

    // if segment is less than remaining distance
    // subtract segments from distance
    // until remaining distance is less than current segment

    while (segmentIndex<this.segments.length-1) {

      var distanceTraveled = distanceTraveledPerTween - remainderDistanceAlongSegment;
      var proceedToNextSegment = true;

      while (proceedToNextSegment) {

        if (segmentIndex>this.segments.length-1) {
          proceedToNextSegment = false;
        } else if (distanceTraveled < this.segments[segmentIndex].length) {
          proceedToNextSegment = false;
        } else {
          console.log("distance until next tween",distanceTraveled);
          distanceTraveled-=this.segments[segmentIndex].length;
          segmentIndex++;
          console.log("segment index",segmentIndex);
        }

      }

      remainderDistanceAlongSegment = distanceTraveled;

      console.log("distance remaining:", remainderDistanceAlongSegment);


      if (segmentIndex<this.segments.length-1) {

        console.log("tween position at segment",segmentIndex);
        // find point at distance along segment
        var nextTweenPosition = this.getPointAtDistanceAlongSegment(distanceTraveled,segmentIndex,startPoint);
        tweenPositions.push(nextTweenPosition);
        segmentIndex++;
        console.log("segment index",segmentIndex);
      }


    }
    // continue to calculate positions until at final segment

    var endPoint = (startPoint==this.endpointA) ? this.endpointB : endpointA;

    tweenPositions.push(endPoint);


    return tweenPositions;
  },


  // how to determine which point of the segment is the origin?
  // the origin is the point closese to the origin of the path
  getPointAtDistanceAlongSegment: function (distance, segmentIndex, originEndpoint) {

    var segment = this.segments[segmentIndex];
    var targetOrigin = originEndpoint.closestPointAmongPoints([segment.a,segment.b]);

    // with current segment
    // get point at distance along line
    // y - y1 = m(x - x1)

    var slope = (segment.a.y - segment.b.y) / (segment.a.x - segment.b.x);

    // y = slope * x;

    // angle = arctan (slope)
    var angle = Math.atan(slope);

    // distance = hypotenuse
    // if slope is positive

    // adjacent = x
    // cos angle = x / distance
    // x = distance * cos angle
    var deltaX = distance * Math.cos(angle);
    console.log("deltaX",deltaX);

    // opposite = y
    // sin angle = y / distance
    // y = distance * sin angle
    var deltaY = distance * Math.sin(angle);
    console.log("deltaY",deltaY);

    // how to apply deltaX and deltaY to origin?
    var targetX, targetY;

    // targetX
    if (segment.a.y==segment.b.y) {
      targetX = targetOrigin.x;
    } else {
      var originLeft = (segment.a.x>segment.b.x) ? segment.b : segment.a;
      var originRight = (segment.a.x>segment.b.x) ? segment.a : segment.b;

      if ( (targetOrigin==originLeft && slope>0) || (targetOrigin==originRight && slope<0) ) {
        targetX = targetOrigin.x + deltaX;
      } else if ( (targetOrigin==originRight && slope>0) || (targetOrigin==originLeft && slope<0) ) {
        targetX = targetOrigin.x - deltaX;
      }
    }

    // targetY
    if (segment.a.x==segment.b.x) {
      targetY = targetOrigin.y;
    } else {
      var originLow = (segment.a.y>segment.b.y) ? segment.b : segment.a;
      var originHigh = (segment.a.y>segment.b.y) ? segment.a : segment.b;

      if ( targetOrigin==originLow ) {
        targetY = targetOrigin.y + deltaY;
      } else if ( targetOrigin==originHigh ) {
        targetY = targetOrigin.y - deltaY;
      }
    }

    var pointAlongPath = new Point(targetX,targetY);

    return pointAlongPath;
  }
};
