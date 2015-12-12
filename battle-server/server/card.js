// card.js

CARD_LOCATION_DECK = 0;
CARD_LOCATION_HAND = 1;
CARD_LOCATION_FIELD = 2;
CARD_LOCATION_GRAVEYARD = 3;

Card = function(config) {

  this.config = config;

  this.location = CARD_LOCATION_DECK;
  this.factory = new UntiFactory();

  this.gameWorld = null;

}

Card.prototype = {

  deployToField: function(rallyPoint) {

    for (var n=0;n<this.config.squadNumber;n++) {
      var unit = new Unit(this.gameWorld.unitClassConfig[this.config.class]);

      this.gameWorld.addUnit(unit);
      this.gameWorld.map.spawnUnitAtLocation(rallyPoint);


    }
  }
}
