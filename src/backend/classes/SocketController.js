var WebSocketServer = require('websocket').server;
var Connection = require('./Connection');
var CEvent = require('./CEvent');

function SocketController() {
  this.wsServer;
  this.connectionsArray;
  this.onNewConnection = new CEvent();
  this.onRemoveConnection = new CEvent();
}

SocketController.prototype.init = function (server) {
  this.connectionsArray = [];

  this.wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: true,
  });
  this.startConnectionListener();
};

SocketController.prototype.startConnectionListener = function () {
  this.wsServer.on('connect', (connection) => {
    this.addConnection(connection);
  });
};

SocketController.prototype.createMessageObject = function (type, text, player) {
  return { type, text, player };
};

SocketController.prototype.addConnection = function (connection) {
  var newConnection = new Connection({
    player: {
      name: `Player${this.connectionsArray.length + 1}`,
      available: true,
    },
    connection,
  });

  this.connectionsArray.push(newConnection);
  this.onNewConnection.trigger(newConnection);

  newConnection.sendMessage(this.createMessageObject('join-ack', `You (${newConnection.player.name}) have been added to the lobby.`, newConnection.player));
  newConnection.onConnectionClose.addEventListener((connection) => this.removeConnection(connection));

  this.updateClients(this.createMessageObject('general-join', `${newConnection.player.name} has joined the lobby.`, newConnection.player));
};

SocketController.prototype.removeConnection = function (connection) {
  var filteredArray = this.connectionsArray.filter(item => item.player.name !== connection.player.name);
  this.connectionsArray = filteredArray;
  this.updateClients(this.createMessageObject('general-leave', `${connection.player.name} has left the lobby.`, 'na', connection.player));
  this.onRemoveConnection.trigger(connection);
};

SocketController.prototype.updateClients = function (message) {
  console.log(message);
  var updatedPlayersArray = this.connectionsArray.map(connection => connection.player);
  this.connectionsArray.forEach(connection => {
    connection.sendMessage({
      type: message.type,
      text: message.text,
      player: message.player,
      updatedPlayersArray,
    });
  });
};

SocketController.prototype.getPlayers = function () {
  return this.connectionsArray.map(connection => connection.playerName);
}

module.exports = SocketController;
