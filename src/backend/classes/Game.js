var CEvent = require('./CEvent');
var constants = require('../utils/constants');

function Game() {
  this.game = {
    playerOne: {
      name: undefined,
      connection: undefined,
    },
    playerTwo: {
      name: undefined,
      connection: undefined,
    },
    board: undefined,
    currentTurn: {
      name: undefined,
    }
  };
  this.socketController;
  this.onGameEnded = new CEvent();
}

Game.prototype.init = function (newGameObj, socketController) {
  this.socketController = socketController;
  console.log(newGameObj);
  this.game = {
    playerOne: {
      name: newGameObj.game.initiatingPlayer,
      connection: newGameObj.gameConnections[0],
    },
    playerTwo: {
      name: newGameObj.game.targetPlayer,
      connection: newGameObj.gameConnections[1],
    },
    currentTurn: {
      name: newGameObj.game.initiatingPlayer,
    }
  };
  this.socketController.updateClients(this.socketController.createMessageObject(
    constants.GAMESTARTED,
    `${this.game.playerOne.name} and ${this.game.playerTwo.name} have started a game.`,
    { name: this.game.playerOne.name, available: false }
  ));
};

Game.prototype.updateGameBoard = function (move) {};

Game.prototype.updatePlayers = function () {};

module.exports = Game;
