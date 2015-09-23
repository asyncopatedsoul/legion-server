// unit.js

UnitFactory = function(classInfo) {
  this.className = classInfo.name;
}

Unit = function(config) {

  this.health = 0;
  this.className = className;
  this.id = UUID.v1();

  this.movementSpeed = config.speed;
  this.position = config.position || { x:0, y:0 };
  this.rallyPoint = null;

  this.projectedPositions = [];
  this.path = null;

  this.movementModifiers = {};

  this.gameWorld = null;
}

Unit.prototype = {

  updateProjectedPositions: function() {
    this.projectedPositions = path.getTweenPoints(this.movementSpeed,this.gameWorld.gameLoopInterval,path.endpointA);
  },

  updateMovementSpeed: function() {
    // factor in buffs / debuffs
    // terrain modifiers

    this.path
  },

  updatePosition: function() {

  },

  updateStatus: function() {
    // health
    // attributes


  }

};