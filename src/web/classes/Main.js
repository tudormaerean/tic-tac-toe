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
  this.socketController.onPlayerHasJoined.addEventListener((message) => {
    this.updatePlayersArray(message);
    this.displayServerMessage(message);
  });
  this.socketController.onPlayerHasLeft.addEventListener((message) => {
    this.updatePlayersArray(message);
    this.displayServerMessage(message);
  });
  this.socketController.onPlayersAvailable.addEventListener((message) => {
    this.updatePlayersArray(message);
    this.displayServerMessage(message);
  });
  this.socketController.onGameStart.addEventListener((message) => {
    this.updatePlayersArray(message);
    this.displayServerMessage(message);
  });
  this.socketController.onGameUpdated.addEventListener((message) => {
    this.updateGame(message);
    this.displayServerMessage(message);
  });
  this.socketController.onGameCompleted.addEventListener((message) => {
    this.updateGame(message);
    this.displayServerMessage(message);
    this.closeGame();
  });
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
  if (this.playersArray) {
    var foundSelf = this.playersArray.find(player => player.name === this.player.name);
    const foundPlayerMessage = {
      player: foundSelf,
    };
    this.updatePlayer(foundPlayerMessage);
  }
  if (message.type !== constants.messageType.JOINACK) {
    if (message.type === constants.messageType.GAMESTARTED) {
      if (this.itsMyGame(message)) {
        this.startGame(message.game, this.socketController);
      }
    }
    if (message.type === constants.messageType.GAMECOMPLETED && this.itsMyGame(message)) {
      this.player.available = true;
      this.closeGame();
    }
    this.lobbyHandler.update(this.playersArray, this.player);
  }
};

Main.prototype.displayServerMessage = function (message) {
  if (message.type === constants.messageType.JOINACK || (message.player && ( message.player.name !== this.player.name))) {
    this.messageHandler.displayMessage(message.text);
  }
  if (message.type === constants.messageType.GAMESTARTED) {
    if (this.itsMyGame(message)) {
      this.messageHandler.displayGameMessages(message.text);
    }
    this.messageHandler.displayMessage(message.text);
    this.updatePlayersArray(message);
  }
  if (message.type === constants.messageType.GAMEUPDATED
    || message.type === constants.messageType.GAMECOMPLETED
    || message.type === constants.messageType.GAMECOMPLETEDDRAW) {
    if (this.itsMyGame(message)) {
      this.messageHandler.displayGameMessages(message.text);
    }
    this.messageHandler.displayMessage(message.text);
  }
  if (message.type === constants.messageType.GENERAL
    || message.type === constants.messageType.GENERALJOIN
    || message.type === constants.messageType.GENERALLEAVE) {
    this.messageHandler.displayMessage(message.text);
  }
};

Main.prototype.itsMyGame = function (message) {
  return message.game.playerOne.name === this.player.name || message.game.playerTwo.name === this.player.name;
};

Main.prototype.startGame = function (game, socketController) {
  if (!this.gameHandler) {
    this.gameHandler = new Game(game, socketController, this.player);
  }
};

Main.prototype.closeGame = function () {
  this.gameHandler = null;
};

Main.prototype.updateGame = function (update) {
  this.gameHandler.updateGame(update);
};

module.exports = Main;
