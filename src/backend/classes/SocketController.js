var WebSocketServer = require('websocket').server;
var Connection = require('./Connection');
var CEvent = require('./CEvent');
var constants = require('../utils/constants');

function SocketController() {
  this.wsServer;
  this.connectionsArray;
  this.onNewConnection = new CEvent();
  this.onRemoveConnection = new CEvent();
  this.constants = constants;
}

SocketController.prototype.init = function (server) {
  this.connectionsArray = [];

  this.wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: true,
  });
  this.startConnectedListener();
};

SocketController.prototype.startConnectedListener = function () {
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

  newConnection.sendMessage(this.createMessageObject(this.constants.JOINACK, `You (${newConnection.player.name}) have been added to the lobby.`, newConnection.player));
  newConnection.onConnectionClose.addEventListener((connection) => this.removeConnection(connection));
  newConnection.onConnectionError.addEventListener((error) => {
    this.removeConnection(newConnection);
    console.log('error', error);
  });

  this.updateClients(this.createMessageObject(this.constants.GENERALJOIN, `${newConnection.player.name} has joined the lobby.`, newConnection.player));
};

SocketController.prototype.removeConnection = function (connection) {
  var filteredArray = this.connectionsArray.filter(item => item.player.name !== connection.player.name);
  this.connectionsArray = filteredArray;
  this.updateClients(this.createMessageObject(this.constants.GENERALLEAVE, `${connection.player.name} has left the lobby.`, connection.player));
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
