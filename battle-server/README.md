FEATURE: PATHING

GOAL: create paths for units based on user-generated map data as collection of intersecting bezier curves 

Take "map data": collection of bezier curves that intersect at juncture points

Calculate length of all curves

Based on a curve's length, flatten curve into line segments 3px < length < 5px 

Recalculate flattened curve total length from sum of line segments

Create path distance index: at D distance along curve, get line segment, then get point on line segment

Given a unit's speed, return the unit's next P positions over P time intervals of T duration.

Game client will render unit movement interpolated from these projects positions, until new movement projections are received from server

New movement projections are calculated and broadcast when:
- unit's speed is modified (buffs, debuffs)
- unit's target path is modified (player changes rally point)
- unit is alerted to a valid target for one of its abilities



FEATURE: AGGRO

GOAL: units should draw aggro from and engage each other

Each unit's has one or more abilities: 
each ability 
  is active? (unit has the required energy equipped or available)
  target specification (ally or enemy unit, unit with certain status)
  targeting type: single target, AOE, skillshot

  does targeting cause movement redirection?
  - i.e. a passive heal AOE will be performed while acting unit is near damaged units, but will not cause the acting unit to follow or seek out a damaged unit
  - i.e. an offensive single target attack (by melee warrior) on an enemy melee unit will cause the active unit to move withing striking range of the enemy unit and stop once in striking range, drawing enemy aggro in response, and causing both units to stay in place unitl one is defeated

  has a alert range (the range in which a valid target is noticed)
  has a targeting range (less than or equal to alert range, the range in which the ability can hit a valid target)
  has a priority order among other abilities
  may cause a unit to move to certain

Unit state:
  hasTarget (another unit)
  isActing (performing an ability) 

On game loop:

  if unit has target, 
    does unit 


TEST CASE: Elf unit with two abilities
  - heal, targets 


