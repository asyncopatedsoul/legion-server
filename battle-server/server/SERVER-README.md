SERVER-README.md

receive bezier curves
flatten curves into contiguous line segments

receive unit deployment request
read unit specifications from library
- movement speed
- abilities

create unit body as object moving along path

set alert/targeting ranges for unit
set rally point and travel path for unit

run game loop:
 for each unit
  - set unit's movement speed  
    check type of terrain unit is in
    check unit's current buffs/debuffs

  - project next [10] movement positions (refresh rate ~100ms)

    with [S] speed over [T] interval along [P] travel path, 
    how much distance has unit traveled?

    - with distance traveled along macro path, what is coordinate along micro path (flattened line segment)?


Map setup

- on game loop update
  each unit advances to its next tween point
  Map gets position of all units
  All units' positions sent to client
  client animates tween

Client requests map data
Server sends map data:
  - path data: arrays of points for lines
  - terrain data: coordinates & properties of terrain objects