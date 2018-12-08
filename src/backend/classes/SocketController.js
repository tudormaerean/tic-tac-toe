var WebSocketServer = require('websocket').server;
var util = require('util');
var Connection = require('./Connection');
var CEvent = require('./CEvent');
var constants = require('../utils/constants');

function SocketController() {
  this.wsServer;
  this.connectionsArray;
  this.onNewGameRequested = new CEvent();
  this.onNewConnection = new CEvent();
  this.onRemoveConnection = new CEvent();
  this.onGameUpdate = new CEvent();
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

SocketController.prototype.createMessageObject = function (type, text, player, game) {
  return { type, text, player, game };
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

  newConnection.sendMessage(this.createMessageObject(constants.messageType.JOINACK, `You (${newConnection.player.name}) have been added to the lobby.`, newConnection.player));
  newConnection.onNewGameRequested.addEventListener((newGameObj) => this.onNewGameRequested.trigger(newGameObj));
  newConnection.onGameUpdate.addEventListener((move) => this.onGameUpdate.trigger(move));
  newConnection.onConnectionClose.addEventListener((connection) => this.removeConnection(connection));
  newConnection.onConnectionError.addEventListener((error) => {
    this.removeConnection(newConnection);
    console.log('error', error);
  });

  this.updateClients(this.createMessageObject(constants.messageType.GENERALJOIN, `${newConnection.player.name} has joined the lobby.`, newConnection.player));
};

SocketController.prototype.removeConnection = function (connection) {
  var filteredArray = this.connectionsArray.filter(item => item.player.name !== connection.player.name);
  this.connectionsArray = filteredArray;
  this.updateClients(this.createMessageObject(constants.messageType.GENERALLEAVE, `${connection.player.name} has left the lobby.`, connection.player));
  this.onRemoveConnection.trigger(connection);
};

SocketController.prototype.makeClientsAvailableGameCompleted = function (messageType, playerWon, playerLost) {
  this.connectionsArray.map(connection => {
    if (connection.player.name === playerWon.name || connection.player.name === playerLost.name) {
      connection.player.available = true;
    }
    return connection;
  });
  var message = this.createMessageObject(
    messageType,
    `${playerWon.name} has won a game against ${playerLost.name}.`,
  );
  this.updateClients(message);
};

SocketController.prototype.updateClients = function (message) {
  var updatedPlayersArray = this.connectionsArray.map(connection => connection.player);
  console.log('updatedPlayersArray', updatedPlayersArray);
  this.connectionsArray.forEach(connection => {
    connection.sendMessage({
      type: message.type,
      text: message.text,
      player: message.player,
      game: message.game,
      updatedPlayersArray,
    });
  });
};

SocketController.prototype.getPlayers = function () {
  return this.connectionsArray.map(connection => connection.playerName);
}

module.exports = SocketController;
