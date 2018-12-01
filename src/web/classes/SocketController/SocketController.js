function SocketController() {
  this.socket;
}

SocketController.prototype.init = function (path) {
  this.socket = new WebSocket(path);
};

SocketController.prototype.startConnectedListener = function () {
  this.socket.onopen = (event) => {
    console.log('You have connected to the game server.');
  };
};

SocketController.prototype.startMessageListener = function (displayServerMessage, updatePlayerId, updatePlayersArray) {
  this.socket.onmessage = (message) => {
    var parsedMessage = JSON.parse(message.data);
    displayServerMessage(parsedMessage.text);
    if (parsedMessage.type === 'general-join' || parsedMessage.type === 'general-leave') {
      updatePlayersArray(parsedMessage.updatedPlayersArray);
    }
    if (parsedMessage.type === 'self-join') {
      updatePlayerId(parsedMessage.id);
    }
    console.log('message', parsedMessage);
  };  
};

module.exports = SocketController;
