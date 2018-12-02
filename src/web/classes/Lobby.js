var CEvent = require('./CEvent');
var template = require('../utils/template');

function Lobby(socketController) {
  this.socketController = socketController;
  this.playersArray;
  this.lobbyDiv = document.getElementById('lobbyContent');
  this.selfDiv;
  this.otherPlayersDiv;
  this.onStartGame = new CEvent();
}

Lobby.prototype.update = function (playersArray, myPlayerName) {
  this.lobbyDiv.innerHTML = '';

  this.selfDiv = template('#self-player-lobby-template');
  this.selfDiv.querySelector('.player-name').innerText = myPlayerName;
  this.lobbyDiv.append(this.selfDiv);

  playersArray.forEach(player => {
    if (player.name === myPlayerName)
      return;
    var otherPlayersDiv = template('#other-players-lobby-template');
    otherPlayersDiv.querySelector('.player-name').innerText = player.name;
    if (player.available) {
      otherPlayersDiv.querySelector('.player-start-game-button').addEventListener('click', () => this.socketController.startGame(player.name));
    } else {
      otherPlayersDiv.querySelector('.player-start-game-button').remove();
    }
    this.lobbyDiv.append(otherPlayersDiv);
  });
};

module.exports = Lobby;
