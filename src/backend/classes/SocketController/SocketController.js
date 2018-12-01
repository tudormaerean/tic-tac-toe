var WebSocketServer = require('websocket').server;
var Connection = require('../Connection/Connection');

function SocketController() {
  this.wsServer;
  this.connectionsArray;
}

SocketController.prototype.init = function (server) {
  this.connectionsArray = [];

  this.wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: true,
  });
};

SocketController.prototype.startConnectionListener = function () {
  this.wsServer.on('connect', (connection) => {
    this.addConnection(connection);
  });
};

SocketController.prototype.addConnection = function (connection) {
  var newConnection = new Connection({
    id: `Player${this.connectionsArray.length + 1}`,
    connection,
  });

  this.connectionsArray.push(newConnection);

  var connectedMessage = {
    type: 'self-join',
    id: newConnection.id,
    text: 'You have been added to the player lobby.'
  };

  newConnection.sendMessage(connectedMessage);
  newConnection.startCloseListener(this.removeConnection.bind(this));

  var message = {
    type: 'general-join',
    text: `${newConnection.id} has joined the lobby.`
  };
  this.updateClients(message);
};

SocketController.prototype.removeConnection = function (connection) {
  var filteredArray = this.connectionsArray.filter(item => item.id !== connection.id);
  this.connectionsArray = filteredArray;
  var message = {
    type: 'general-leave',
    text: `${connection.id} has left the lobby.`
  };
  this.updateClients(message);
};

SocketController.prototype.updateClients = function (message) {
  var updatedPlayersArray = this.connectionsArray.map(connection => connection.id);
  this.connectionsArray.forEach(connection => {
    connection.sendMessage({
      type: message.type,
      text: message.text,
      updatedPlayersArray,
    });
  });
};

// SocketController.prototype.startCloseListener = function(removeConnectionsCallback) {
//   this.wsServer.on('close', () => {
//     removeConnectionsCallback();
//   });
// };

module.exports = SocketController;
