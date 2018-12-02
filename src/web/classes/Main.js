var SocketController = require('./SocketController');
var UIMessage = require('./UIMessage');
var Lobby = require('./Lobby');

var serverSocketPath = 'ws://' + window.location.hostname + ':3000';

function Main() {
  this.state;
  this.player = {
    name: undefined,
    available: undefined,
  };
  this.playersArray;
  this.socketController;
  this.messageHandler;
  this.lobbyHandler;
}

Main.prototype.init = function() {
  this.messageHandler = new UIMessage();
  this.messageHandler.init();
  this.socketController = new SocketController();
  this.socketController.onGettingNamed.addEventListener((message) => this.updatePlayerName(message));
  this.socketController.onMessageReceived.addEventListener((message) => this.displayServerMessage(message));
  this.socketController.onPlayerHasJoined.addEventListener((message) => this.updatePlayersArray(message));
  this.socketController.onPlayerHasLeft.addEventListener((message) => this.updatePlayersArray(message));
  this.socketController.init(serverSocketPath);
  this.lobbyHandler = new Lobby(this.socketController);
};

Main.prototype.updatePlayerName = function(message) {
  this.player = message.player;
};

Main.prototype.updatePlayersArray = function(message) {
  this.playersArray = message.updatedPlayersArray;
  this.lobbyHandler.update(this.playersArray, this.player.name);
};

Main.prototype.displayServerMessage = function (message) {
  if (message.type === 'join-ack' || message.player.name !== this.player.name) {
    this.messageHandler.displayMessage(message.text);
  }
};

module.exports = Main;
