var Cell = require('./Cell');
var template = require('../utils/template');
var constants = require('../utils/constants');

function Game(game, socketController, player) {
  this.whosTurnIsIt = game.currentTurn.name;
  this.player = player;
  this.game = game;
  this.socketController = socketController;
  this.gameDiv = document.getElementById('gameContent');
  this.clearBoard();
  this.updateBoard(game.board);
}

Game.prototype.updateBoard = function (board) {
  this.itsMyTurn = this.player.name === this.whosTurnIsIt;
  this.game.board = [];
  for (var indexRow = 0; indexRow < board.length; indexRow++) {
    var newColumn = [];
    var newColumnDiv = template('#board-row-template');
    this.gameDiv.append(newColumnDiv);
    for (var indexColumn = 0; indexColumn < board.length; indexColumn++) {
      var newCell = new Cell(board[indexRow][indexColumn], newColumnDiv, indexRow, indexColumn, this.itsMyTurn);
      newCell.onCellClick && newCell.onCellClick.addEventListener((row, column) => this.move({ row, column }));
      newColumn.push(newCell.div);
    }
    this.game.board.push(newColumn);
  }
};

Game.prototype.move = function (move) {
  this.socketController.sendMessage(this.socketController.createMessageObject(constants.messageType.GAMEMOVE, undefined, this.player.name, move));
};

Game.prototype.clearBoard = function () {
  while (this.gameDiv.firstChild) this.gameDiv.removeChild(this.gameDiv.firstChild);
};

Game.prototype.updateGame = function (update) {
  this.whosTurnIsIt = update.type === constants.messageType.GAMECOMPLETED ? undefined : update.game.currentTurn.name;
  this.clearBoard();
  this.updateBoard(update.game.board);
};

module.exports = Game;
