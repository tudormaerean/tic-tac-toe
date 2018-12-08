var CEvent = require('./CEvent');
var template = require('../utils/template');
var constants = require('../utils/constants');

function Cell(value, parentRowDiv, indexRow, indexColumn, itsMyTurn) {
  this.itsMyTurn = itsMyTurn;
  this.value = value;
  this.indexRow = indexRow;
  this.indexColumn = indexColumn;
  this.parentRowDiv = parentRowDiv;
  this.div = template('#board-cell-template');
  this.div.querySelector('.board-cell-content').innerText = this.value;
  this.parentRowDiv.append(this.div);
  if (this.value === constants.cellType.FREE && this.itsMyTurn) {
    this.onCellClick = new CEvent();
    this.div.addEventListener('click', () => this.onCellClick.trigger(this.indexRow, this.indexColumn));
  }
}

Cell.prototype.updateValue = function (value) {
  this.div.innerText = value;
};

module.exports = Cell;
