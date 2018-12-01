function Lobby() {
  this.playersArray;
  this.div;
}

Lobby.prototype.init = function (playersArray) {
  this.div = document.getElementById('lobbyContent');
  this.div.innerHTML = null;
  this.playersArray = playersArray;
  this.playersArray.forEach(player => {
    var newPlayerDiv = document.createElement('div');
    newPlayerDiv.innerHTML = player;
    this.div.append(newPlayerDiv);
  });
};

module.exports = Lobby;
