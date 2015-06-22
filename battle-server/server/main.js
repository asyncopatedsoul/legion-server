

var endpointA = new Point(150,40), endpointB = new Point(105,150), controlPoint = new Point(80,30);

var curve = new BezierCurve(endpointA,controlPoint,endpointB);

var segments = curve.flatten(5);
var path = new Path(endpointA,endpointB,segments);

console.log("path Length",path.length);
console.log("path segments", path.segments.length);

var tweenPoints = path.getTweenPoints(10,300,path.endpointA);
console.log("tweenPoints",tweenPoints);

var eventEmitter = new EventEmitter();
var websocketDelegate = new WebSocketDelegate(9999,eventEmitter);

eventEmitter.emit("broadcastToClient",{topic:"mapData",body:curve.LUT});

// create card

// 

eventEmitter.emit();