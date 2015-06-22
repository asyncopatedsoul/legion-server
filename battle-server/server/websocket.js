// WebSocket Server

// #!/usr/bin/env node
/************************************************************************
 *  Copyright 2010-2011 Worlize Inc.
 *  
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  
 *      http://www.apache.org/licenses/LICENSE-2.0
 *  
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ***********************************************************************/

// https://github.com/theturtle32/WebSocket-Node/blob/master/docs/index.md

//var WebSocketServer = Meteor.npmRequire('websocket').server;
var express = Meteor.npmRequire('express');
var http = Meteor.npmRequire('http');
var io = Meteor.npmRequire('socket.io');

WebSocketDelegate = function (port, eventEmitter) {

  this.events = eventEmitter;
  this.connections = [];

  // var app = express.createServer();
  // app.listen(port);

  // this.server

  var app = express();
  var httpServer = http.createServer(app);
  this.server = io(httpServer);

  this.server.on('connection', onConnection.bind(this) );

  function onConnection (socket) {
    console.log(socket);
    this.connections.push(socket);

    //connection.on('close', onClose.bind(this));
    //connection.on('message', onMessage.bind(this));
  }

  httpServer.listen(port);

  this.events.on('broadcastToClient',broadcastToClient.bind(this));
    
  //this.server.on('request', onRequest.bind(this));

  function broadcastToClient(data) {

    // TO LIMIT MESSAGES TO CLIENT
    // SEND CLIENT ONLY "smarttouch" MESSAGES

    //if (data.topic=="smarttouch-start" || data.topic=="smarttouch-end" || data.topic=="board-restart") {
      this.write(data.topic,data.body);
    //}

  }

  function onRequest(request) {
    console.log('requestedProtocols:',request.requestedProtocols);

      // UniWeb plugin requests 'chat','superchat' protocols
      // req.headers.Add ("Sec-WebSocket-Protocol", "chat, superchat");
      // in ./Assets/UniWeb/Plugins/HTTP/WebSocket.cs

      // The "Sec-WebSocket-Protocol" header lists the subprotocols
      // https://github.com/theturtle32/WebSocket-Node/issues/32

      var connection = request.accept('chat', request.origin);
      connection.on('close', onClose.bind(this));
      connection.on('message', onMessage.bind(this));

      this.connections.push(connection);

      console.log("New websocket connection:",connection.remoteAddress);
      
  }

  function onClose(connection) { // Handle closed connections
      console.log(connection + " disconnected");
      
      var index = this.connections.indexOf(connection);
      if (index !== -1) {
          // remove the connection from the pool
          connections.splice(index, 1);
      }
  }

  function onMessage(message) { // Handle incoming messages
    console.log("MESSAGE FROM CLIENT:",message);

      if (message.type === 'utf8') {
          try {
              var messageObject = JSON.parse(message.utf8Data);
              console.log(messageObject);

              this.parseClientMessage(messageObject);
          }
          catch(e) {
              // do nothing if there's an error.
              console.log("data not valid json.");
          }
      }
  }

  console.log("SmartTouch server ready");
};

WebSocketDelegate.prototype = {

    write: function (msg, data) {
      console.log("websocket write:",msg,data);
      if (this.connections.length==0) {
        console.log("no WebSocket  connections.");
        return false;
      } else {
        
        console.log("sending:",msg,data);

        _.each(this.connections,function(connection){
            connection.emit(msg,data);
        });

        return true;
      }
        
    },

    parseClientMessage: function (messageObject) {

      var topic = messageObject.topic, message = messageObject.message;

      switch (topic) {
        case "antennas":
          // client wants to know where to draw live antenna zones on screen
          this.events.emit("reportAntennaZones");
        break;

        case "smartpieces":
          // client wants to know association between RFTag IDs and GameObjects
          this.events.emit("reportSmartPieceManifest");
        break;

        case "lightup":
          // client wants to light up a smart piece
          console.log("parse: lightup");
          this.events.emit("lightingAction",message);
        break;

        default:
        break;
      }
    } 
}
