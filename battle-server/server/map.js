// map.js

// RallyPoint type

RallyPoint = function() {

  this.type = null;

}

Map = function() {
  
  this.paths = [];
  this.units = [];

  this.terrainZones = [];

  this.rallyPoints = {};

}

Map.prototype = {

  getTerrainZoneAtLocation: function(location) {

    // return terrainZone

  },
  
  addPath: function (path) {


  },

  spawnUnitAtLocation: function(unit) {
    // place on map at location
  },

  removeUnit: function(unit) {

  },

  getAllUnitPositions: function() {

  }
}

