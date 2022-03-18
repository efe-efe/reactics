const express = require("express")
const bodyParser = require("body-parser");
const PORT = 3000;
const app = express();

let connections = [];
const state = {
  distribution: [],
  phase: 0,
}

const actionHandlers = {
  nextPhase() {
    state.phase = state.phase + 1;
  },
  previousPhase() {
    state.phase = Math.max(0, state.phase - 1);
  }
}

//This will answer with the part of the state that was changed and the action called. 
//The Client should know which part of his state he needs to change accordingly
//Also, it will only answer to clients that are not the one that sent the initial request
function InformSubscribers(response, filteredConnections) {
  for (const connection of filteredConnections) {
    console.log(`Informing about the state to Player ${connection.playerId} (${connection.source})`);
    if(!connection.handler){
      console.log("The connection is broken!")
    } else {
      const handler = connection.handler;
      connection.handler = undefined;
      handler.send(response);
      handler.end();
    }
  }
}

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.post("/action", (req, res, next) => {
  console.log(`Incoming action: ${req.body.eventName} from player ${req.body.playerId}`);

  if (actionHandlers[req.body.eventName]) {
    actionHandlers[req.body.eventName]();
  }

  const response = {
    ok: true,
    playerId: req.body.playerId,
    eventName: req.body.eventName,
    informAll: true,
    payload: {
      state: {
        phase: state.phase,
      }
    }
  }

  const filteredConnections = connections.filter((connection) => connection.playerId != req.body.playerId)
  InformSubscribers(response, filteredConnections);
  res.send(response);
  res.end();
})

app.post("/subscribe", (req, res, next) => {
  const source = req.body.source;
  const playerId = req.body.playerId;
  const connection = connections.find((connection) => connection.playerId == playerId)
  
  console.log(`Player ${playerId} from ${source} is trying to subscribe`);

  if(connection){
    connection.handler = res;
  } else {
    connections.push({
      source,
      playerId,
      handler: res
    })
  }
  
  console.log("Connections: ", connections.length);
})

app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`)
})