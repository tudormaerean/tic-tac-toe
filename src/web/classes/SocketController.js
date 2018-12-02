var CEvent = require('./CEvent');
var constants = require('../utils/constants');

function SocketController() {
  this.socket;
  this.onMessageReceived = new CEvent();
  this.onPlayerHasJoined = new CEvent();
  this.onPlayerHasLeft = new CEvent();
  this.onGettingNamed = new CEvent();
  this.constants = constants;
}

SocketController.prototype.init = function (path) {
  this.socket = new WebSocket(path);
  this.startConnectedListener();
  this.startMessageListener();
};

SocketController.prototype.startConnectedListener = function () {
  this.socket.onopen = (event) => {
    console.log('You have connected to the game server.');
  };
};

SocketController.prototype.startMessageListener = function () {
  this.socket.onmessage = (message) => {
    var parsedMessage = JSON.parse(message.data);
    this.onMessageReceived.trigger(parsedMessage);
    switch (parsedMessage.type) {
      case this.constants.GENERALJOIN:
        this.onPlayerHasJoined.trigger(parsedMessage);
        break;
      case this.constants.GENERALLEAVE:
        this.onPlayerHasLeft.trigger(parsedMessage);
        break;
      case this.constants.JOINACK:
        this.onGettingNamed.trigger(parsedMessage);
        break;
    }
    console.log('message', parsedMessage);
  };  
};

SocketController.prototype.createMessageObject = function (type, target) {
  return {
    type,
    target,
  };
};

SocketController.prototype.sendMessage = function (message) {
  this.socket.send(JSON.stringify(message));
};

SocketController.prototype.startGame = function (targetPlayer) {
  this.sendMessage(this.createMessageObject(this.constants.REQUESTNEWGAME, targetPlayer));
};

SocketController.prototype.playMove = function (move) {
  this.sendMessage(this.createMessageObject(this.constants.MOVE, move));
};

module.exports = SocketController;
