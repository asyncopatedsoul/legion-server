
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
    
    var segment = new Segment(pointA,pointB);

    segments.push(segment);
  }
});

var endpointA = new Point(150,40), endpointB = new Point(105,150);

var path = new Path(endpointA,endpointB,segments);

console.log("path Length",path.length);
console.log("path segments", path.segments.length);

var tweenPoints = path.getTweenPointsAlongPath(25,300,path.endpointA);
console.log("tweenPoints",tweenPoints);