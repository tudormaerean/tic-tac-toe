var CEvent = require('./CEvent');
var constants = require('../utils/constants');

function Game() {
  this.playerOne = {
    name: undefined,
    symbol: undefined,
    connection: undefined,
  };
  this.playerTwo = {
    name: undefined,
    symbol: undefined,
    connection: undefined,
  };
  this.board = undefined,
  this.currentTurn = {
    name: undefined,
  };
  this.boardSideLength;
  this.socketController;
  this.onGameEnded = new CEvent();
}

Game.prototype.init = function (newGameObj, socketController) {
  this.socketController = socketController;
  this.playerOne = {
    name: newGameObj.game.initiatingPlayer,
    symbol: constants.cellType.X,
    connection: newGameObj.gameConnections[0],
  };
  this.playerTwo = {
    name: newGameObj.game.targetPlayer,
    symbol: constants.cellType.O,
    connection: newGameObj.gameConnections[1],
  };
  this.currentTurn = {
    name: newGameObj.game.initiatingPlayer,
  };
  this.boardSideLength = newGameObj.game.boardSize;
  this.board = this.initBoard();
  this.socketController.updateClients(this.socketController.createMessageObject(
    constants.messageType.GAMESTARTED,
    `${this.playerOne.name} and ${this.playerTwo.name} have started a game.`,
    undefined,
    {
      playerOne: {
        name: newGameObj.game.initiatingPlayer,
        symbol: constants.cellType.X,
      },
      playerTwo: {
        name: newGameObj.game.targetPlayer,
        symbol: constants.cellType.O,
      },
      currentTurn: this.playerOne,
      board: this.board,
    },
  ));
};

Game.prototype.initBoard = function () {
  var board = [];
  for (var indexRow = 0; indexRow < this.boardSideLength; indexRow++) {
    var newColumn = [];
    for (var indexColumn = 0; indexColumn < this.boardSideLength; indexColumn++) {
      newColumn.push(constants.cellType.FREE);
    }
    board.push(newColumn);
  }
  return board;
};

Game.prototype.updateGameBoard = function (update) {
  this.board[update.game.move.row][update.game.move.column] = this.currentTurn.name === this.playerOne.name ? constants.cellType.X : constants.cellType.O;
  const whoWon = this.checkVictoryConditions();
  this.currentTurn.name = this.currentTurn.name === this.playerOne.name? this.playerTwo.name : this.playerOne.name;
  if (whoWon) {
    this.updatePlayers(
      whoWon === 'draw' ? constants.messageType.GAMECOMPLETEDDRAW : constants.messageType.GAMECOMPLETED,
      update.game.player,
      this.currentTurn,
      update.game.move.row,
      update.game.move.column
    );
    this.socketController.makeClientsAvailableGameCompleted(
      constants.messageType.PLAYERSAVAILABLE,
      update.game.player,
      this.currentTurn
    );
    this.onGameEnded.trigger();
  } else {
    this.updatePlayers(constants.messageType.GAMEUPDATED, update.game.player, this.currentTurn, update.game.move.row, update.game.move.column);
  }
};

Game.prototype.checkVictoryConditions = function () {
  var victoryConditionRegex = RegExp(`[X]{${this.board.length}}|[O]{${this.board.length}}`);
  var addVerticalValues = [];
  var firstDiagonalValues = '';
  var secondDiagonalValues = '';
  var fullMatrixValues = '';
  for (var indexRow = 0; indexRow < this.board.length; indexRow++) {
    var addHorizontalValues = '';
    for (var indexColumn = 0; indexColumn < this.board.length; indexColumn++) {
      fullMatrixValues += this.board[indexRow][indexColumn];
      addHorizontalValues += this.board[indexRow][indexColumn];
      if (indexRow === indexColumn) {
        firstDiagonalValues += this.board[indexRow][indexColumn];
      }
      if ((indexRow + indexColumn + 1) === this.board.length) {
        secondDiagonalValues += this.board[indexRow][indexColumn];
      }
      if (victoryConditionRegex.test(addHorizontalValues)) {
        return addHorizontalValues;
      }
      if (victoryConditionRegex.test(firstDiagonalValues)) {
        return firstDiagonalValues;
      }
      if (victoryConditionRegex.test(secondDiagonalValues)) {
        return secondDiagonalValues;
      }
    }
    addVerticalValues = this.board.map(value => value[indexRow]).join('');
    if (victoryConditionRegex.test(addVerticalValues)) {
      return addVerticalValues;
    }
    addVerticalValues = [];
  }
  if (fullMatrixValues.length === Math.pow(this.board.length, 2)) {
    return 'draw';
  }
  return;
};

Game.prototype.updatePlayers = function (messageType, whoMadeTheMove, whosTurnIsItNow, row, column) {
  var messageText = '';
  switch (messageType) {
    case constants.messageType.GAMEUPDATED:
      messageText = `${whoMadeTheMove.name} selected cell ${row}-${column} and it's now ${whosTurnIsItNow.name}'s turn.`;
      break;
    case constants.messageType.GAMECOMPLETED:
      messageText = `${whoMadeTheMove.name} has won the game, congratulations! ${whosTurnIsItNow.name} has lost, better luck next time...`;
      break;
    case constants.messageType.GAMECOMPLETEDDRAW:
      messageText = `${whoMadeTheMove.name} and ${whosTurnIsItNow.name} have reached a draw.`;
      break;
  }
  var message = this.socketController.createMessageObject(
    messageType,
    messageText,
    undefined,
    {
      playerOne: {
        name: this.playerOne.name,
        symbol: constants.cellType.X,
      },
      playerTwo: {
        name: this.playerTwo.name,
        symbol: constants.cellType.O,
      },
      currentTurn: whosTurnIsItNow,
      board: this.board,
    },
  );
  this.socketController.connectionsArray.find(connection => connection.player.name === this.playerOne.name).sendMessage(message);
  this.socketController.connectionsArray.find(connection => connection.player.name === this.playerTwo.name).sendMessage(message);
};

module.exports = Game;
