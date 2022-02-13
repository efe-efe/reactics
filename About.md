## Reactics

Reactics is a tactics games created entirely with React and using Dota Tools Framework as a backend service.

## Gameplay

The game explained as a flowchart:

# Preparation phase

* A random map is generated.
* A random relic is applied to the match.
* A random item is asigned to each player.

# Picking phase

* Each player have to pick 4 units from a pool of 10

    * Player A picks 1
    * Player B picks 2
    * Player A picks 2
    * Player B picks 2
    * Player A picks 1

* The remaining 2 are tossed out.


# Placement phase
The players start to place their units on the map:

* Players will play only 3 from the 4 units they have.
* Players can only place units on it's own half of the map.
* Each player secretely adds one unit, once both confirm, the placement of the unit is revealed.
* When done with units, players play a last entity on the board: their Stone of Life

# Game Starts

The game is divided in turns:
* Each turn a player can move one unit and pass.
* Players can't use the same unit twice in a row (except if that's their only unit left)
* The game ends when one player destroy the Stone of Life of the other one.

# Glosary

* Items: cards that are either equiped in one of your units or used freely in the game.