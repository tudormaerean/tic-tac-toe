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

Lobby.prototype.update = function (playersArray, myPlayer) {
  this.lobbyDiv.innerHTML = '';

  this.selfDiv = template('#self-player-lobby-template');
  this.selfDiv.innerText = myPlayer.name;
  this.lobbyDiv.append(this.selfDiv);

  playersArray.forEach(player => {
    if (player.name === myPlayer.name)
      return;
    if (player.available && myPlayer.available) {
      var otherPlayersDiv = template('#other-players-available-lobby-template');
      otherPlayersDiv.querySelector('.player-start-game-button').addEventListener('click', () => this.socketController.startGame(player.name, myPlayer.name));
      otherPlayersDiv.querySelector('.player-name').innerText = player.name;
    }
    if (!player.available || !myPlayer.available) {
      var otherPlayersDiv = template('#other-players-notavailable-lobby-template');
      otherPlayersDiv.innerText = player.name;
    }
    this.lobbyDiv.append(otherPlayersDiv);
  });
};

module.exports = Lobby;
