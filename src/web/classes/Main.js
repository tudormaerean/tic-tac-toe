var SocketController = require('./SocketController');
var UIMessage = require('./UIMessage');
var Lobby = require('./Lobby');
var Game = require('./Game');
var constants = require('../utils/constants');

var serverSocketPath = 'ws://' + window.location.hostname + ':3000';

function Main() {
  this.player = {
    name: undefined,
    available: undefined,
  };
  this.playersArray;
  this.socketController;
  this.messageHandler;
  this.lobbyHandler;
  this.gameHandler;
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
  this.socketController.onGameUpdated.addEventListener((message) => this.updateGame(message));
  this.socketController.init(serverSocketPath);
  this.lobbyHandler = new Lobby(this.socketController);
};

Main.prototype.updatePlayer = function(message) {
  if (!this.player.name || this.player.name === message.player.name) {
    this.player = message.player;
  }
};

Main.prototype.updatePlayersArray = function(message) {
  this.playersArray = message.updatedPlayersArray;
  if (message.type !== constants.messageType.JOINACK) {
    if (message.type === constants.messageType.GAMESTARTED) {
      const itsMyGame = message.game.playerOne.name === this.player.name || message.game.playerTwo.name === this.player.name;
      if (itsMyGame) {
        const foundPlayerMessage = {
          player: message.updatedPlayersArray.find(player => player.name === this.player.name)
        };
        this.updatePlayer(foundPlayerMessage);
        this.startGame(message.game, this.socketController);
      }
    }
    this.lobbyHandler.update(this.playersArray, this.player);
  }
};

Main.prototype.displayServerMessage = function (message) {
  if (message.type === constants.messageType.JOINACK || (message.player && ( message.player.name !== this.player.name))) {
    this.messageHandler.displayMessage(message.text);
  }
  if (message.type === constants.messageType.GAMESTARTED) {
    this.messageHandler.displayMessage(message.text);
    this.updatePlayersArray(message);
  }
};

Main.prototype.startGame = function (game, socketController) {
  this.gameHandler = new Game(game, socketController, this.player);
};

Main.prototype.updateGame = function (update) {
  this.messageHandler.displayMessage(update.text);
  this.gameHandler.updateGame(update);
};

module.exports = Main;
