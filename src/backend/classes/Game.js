var CEvent = require('./CEvent');
var constants = require('../utils/constants');

const BoardSideLength = 3;

function Game() {
  this.playerOne = {
    name: undefined,
    connection: undefined,
  };
  this.playerTwo = {
    name: undefined,
    connection: undefined,
  };
  this.board = undefined,
  this.currentTurn = {
    name: undefined,
  };
  this.socketController;
  this.onGameEnded = new CEvent();
}

Game.prototype.init = function (newGameObj, socketController) {
  this.socketController = socketController;
  this.playerOne = {
    name: newGameObj.game.initiatingPlayer,
    connection: newGameObj.gameConnections[0],
  };
  this.playerTwo = {
    name: newGameObj.game.targetPlayer,
    connection: newGameObj.gameConnections[1],
  };
  this.currentTurn = {
    name: newGameObj.game.initiatingPlayer,
  };
  this.board = this.initBoard(BoardSideLength)
  this.socketController.updateClients(this.socketController.createMessageObject(
    constants.messageType.GAMESTARTED,
    `${this.playerOne.name} and ${this.playerTwo.name} have started a game.`,
    undefined,
    {
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
      },
      board: this.board,
    },
  ));
};

Game.prototype.initBoard = function () {
  var board = [];
  for (var indexRow = 0; indexRow < BoardSideLength; indexRow++) {
    var newColumn = [];
    for (var indexColumn = 0; indexColumn < BoardSideLength; indexColumn++) {
      newColumn.push(constants.cellType.FREE);
    }
    board.push(newColumn);
  }
  return board;
};

Game.prototype.updateGameBoard = function (update) {
  this.board[update.game.move.row][update.game.move.column] = this.currentTurn.name === this.playerOne.name ? constants.cellType.X : constants.cellType.O;
  this.checkVictoryConditions();
  this.currentTurn.name = this.currentTurn.name === this.playerOne.name? this.playerTwo.name : this.playerOne.name;
  this.updatePlayers(update.game.player.name, this.currentTurn.name, update.game.move.row, update.game.move.column);
};

Game.prototype.checkVictoryConditions = function () {

};

Game.prototype.updatePlayers = function (whoMadeTheMove, whosTurnIsItNow, row, column) {
  const message = this.socketController.createMessageObject(
    constants.messageType.GAMEUPDATED,
    `${whoMadeTheMove} selected cell ${row}-${column} and it's now ${whosTurnIsItNow}'s turn.`,
    undefined,
    {
      playerOne: {
        name: this.playerOne.name,
        connection: this.playerOne.connection,
      },
      playerTwo: {
        name: this.playerTwo.name,
        connection: this.playerTwo.connection,
      },
      currentTurn: {
        name: whosTurnIsItNow,
      },
      board: this.board,
    },
  );
  console.log('game update message', message);
  this.socketController.connectionsArray.find(connection => connection.player.name === this.playerOne.name).sendMessage(message);
  this.socketController.connectionsArray.find(connection => connection.player.name === this.playerTwo.name).sendMessage(message);
};

module.exports = Game;
