var CEvent = require('./CEvent');
var constants = require('../utils/constants');

function SocketController() {
  this.socket;
  this.onMessageReceived = new CEvent();
  this.onPlayerHasJoined = new CEvent();
  this.onPlayerHasLeft = new CEvent();
  this.onJoining = new CEvent();
  this.onGameStart = new CEvent();
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
      case constants.GENERALJOIN:
        this.onPlayerHasJoined.trigger(parsedMessage);
        break;
      case constants.GENERALLEAVE:
        this.onPlayerHasLeft.trigger(parsedMessage);
        break;
      case constants.JOINACK:
        this.onJoining.trigger(parsedMessage);
      case constants.STARTGAME:
        this.onGameStart.trigger(parsedMessage);
        break;
    }
    console.log('message', parsedMessage);
  };  
};

SocketController.prototype.createMessageObject = function (type, target, myPlayerName) {
  switch (type) {
    case constants.REQUESTNEWGAME:
      return {
        type: constants.REQUESTNEWGAME,
        game: {
          targetPlayer: target,
          initiatingPlayer: myPlayerName,
        },
      };
  };
};

SocketController.prototype.sendMessage = function (message) {
  console.log('state', this.socket.readyState);
  this.socket.send(JSON.stringify(message));
};

SocketController.prototype.startGame = function (targetPlayer, myPlayerName) {
  this.sendMessage(this.createMessageObject(constants.REQUESTNEWGAME, targetPlayer, myPlayerName));
};

SocketController.prototype.playMove = function (move) {
  this.sendMessage(this.createMessageObject(constants.MOVE, move));
};

module.exports = SocketController;
