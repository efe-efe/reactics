# Architecture

* State Server (Express): Mantains and modifies the state of the game.
* Web Client (React)
* Dota Server (LUA)
* Dota Client (React + Panorama)

# Communication

The game can be established in one of the following ways:
* Both players uses the `Web Client`.
* Both players uses the `Dota Client` (and therefore both are hold on the `Dota Server`).
* One player uses the `Web Client` and the other uses the `Dota Client`.

## Dota
### Client
* The Client state is hold on the Redux Store.
* The Redux Store is listening to the game state. When the game state is updated, the store is updated and the changes are reflected on the Client UI.
* All actions are dispatched from the Redux Store.
* The game state is shown partially to each player and only contains the minimum necessary information.

### Flow
Initialization
* `Dota Server` sends a request to `State Server` to initialize the long polling

Player Action
* `Player` executes an action on the `Dota Client` through `Redux Dispatch`.
* The action is validated on the `Dota Client`. If invalid inform the player and stops the flow.
* If Valid, the Redux dispatch sends an event to `Dota Server`.
* `Dota Server` send a request with the action info to `State Server`
* `State Server` processes the request and updates the state of the game.
* When the state of the game is updated, the long polling response is served to the `Dota Server` with the updated state.
* `Dota Server` processes the long polling response sending the results to `Dota Client` and re-initializing the long polling with a new request.

## State Server
### Requests
Development:
* There are some requests that can only be done on development mode. For that we need two things:
    * Server should allow those calls only when it is on dev mode
    * Client should only print those call to actions when is on dev mode

There are two kind of requests:
* Client: Returns the result to the client asking.
* All Clients: Returns the result to all the clients listening.

### Requests List
* Connect:
    * Endpont "/connect"
    * Parameters: null
    * Description: The client initialze a Long Polling comunication with the server.
* Action:
    * Endpoint: "/action"
    * Parameters:
        * Type
        * Payload
    * Description: An action that modifies the current state of the game (moves a unit, attacks, casts an spell, etc). If the action is illegal, the answer is sent to the Client asking. If the action is legal, the state is modified and the answer is sent to All Clients
