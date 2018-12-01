var SocketController = require('../SocketController/SocketController');
var UIMessage = require('../UIMessage/UIMessage');
var Lobby = require('../Lobby/Lobby');

var serverSocketPath = 'ws://' + window.location.hostname + ':3000';

function Main() {
  this.state;
  this.playerId;
  this.playersArray;
  this.socketController;
  this.messageHandler;
  this.lobbyHandler;
}

Main.prototype.init = function() {
  this.messageHandler = new UIMessage();
  this.messageHandler.init();
  this.socketController = new SocketController();
  this.socketController.init(serverSocketPath);
  this.socketController.startConnectedListener();
  this.socketController.startMessageListener(
    this.displayServerMessage.bind(this),
    this.updatePlayerId.bind(this),
    this.updatePlayersArray.bind(this)
  );
  this.lobbyHandler = new Lobby();
};

Main.prototype.updatePlayerId = function(id) {
  this.playerId = id;
};

Main.prototype.updatePlayersArray = function(array) {
  this.playersArray = array;
  this.lobbyHandler.init(this.playersArray);
};

Main.prototype.displayServerMessage = function (text) {
  this.messageHandler.displayMessage(text);
};

module.exports = Main;
