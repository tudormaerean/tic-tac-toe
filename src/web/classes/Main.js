var SocketController = require('./SocketController');
var UIMessage = require('./UIMessage');
var Lobby = require('./Lobby');
var constants = require('../utils/constants');

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
  this.socketController.onJoining.addEventListener((message) => this.updatePlayer(message));
  this.socketController.onMessageReceived.addEventListener((message) => this.displayServerMessage(message));
  this.socketController.onPlayerHasJoined.addEventListener((message) => this.updatePlayersArray(message));
  this.socketController.onPlayerHasLeft.addEventListener((message) => this.updatePlayersArray(message));
  this.socketController.onGameStart.addEventListener((message) => this.updatePlayersArray(message));
  this.socketController.init(serverSocketPath);
  this.lobbyHandler = new Lobby(this.socketController);
};

Main.prototype.updatePlayer = function(message) {
  this.player = message.player;
};

Main.prototype.updatePlayersArray = function(message) {
  this.playersArray = message.updatedPlayersArray;
  if (message.type !== constants.JOINACK) {
    this.lobbyHandler.update(this.playersArray, this.player);
  }
};

Main.prototype.displayServerMessage = function (message) {
  if (message.type === constants.JOINACK || (message.player && ( message.player.name !== this.player.name))) {
    this.messageHandler.displayMessage(message.text);
  }
  if (message.type === constants.GAMESTARTED) {
    this.messageHandler.displayMessage(message.text);
    this.updatePlayer(message);
    this.updatePlayersArray(message);
  }
};

module.exports = Main;
