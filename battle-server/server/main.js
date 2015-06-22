

var endpointA = new Point(150,40), endpointB = new Point(105,150), controlPoint = new Point(80,30);

var curve = new BezierCurve(endpointA,controlPoint,endpointB);

var path = new Path(endpointA,endpointB,curve.flatten(5));

console.log("path Length",path.length);
console.log("path segments", path.segments.length);

var tweenPoints = path.getTweenPoints(10,300,path.endpointA);
console.log("tweenPoints",tweenPoints);