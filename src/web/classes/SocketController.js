var jc = require('json-cycle');
var CEvent = require('./CEvent');
var constants = require('../utils/constants');

function SocketController() {
  this.socket;
  this.onMessageReceived = new CEvent();
  this.onPlayerHasJoined = new CEvent();
  this.onPlayerHasLeft = new CEvent();
  this.onJoining = new CEvent();
  this.onGameStart = new CEvent();
  this.onGameUpdated = new CEvent();
  this.onGameCompleted = new CEvent();
  this.onPlayersAvailable = new CEvent();
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
    var parsedMessage = jc.parse(message.data);
    // this.onMessageReceived.trigger(parsedMessage);
    switch (parsedMessage.type) {
      case constants.messageType.GENERALJOIN:
        this.onPlayerHasJoined.trigger(parsedMessage);
        break;
      case constants.messageType.GENERALLEAVE:
        this.onPlayerHasLeft.trigger(parsedMessage);
        break;
      case constants.messageType.JOINACK:
        this.onJoining.trigger(parsedMessage);
      case constants.messageType.GAMESTARTED:
        this.onGameStart.trigger(parsedMessage);
        break;
      case constants.messageType.GAMEUPDATED:
        this.onGameUpdated.trigger(parsedMessage);
        break;
      case constants.messageType.GAMECOMPLETED:
        this.onGameCompleted.trigger(parsedMessage);
        break;
      case constants.messageType.GENERAL:
        this.onMessageReceived.trigger(parsedMessage);
        break;
      case constants.messageType.PLAYERSAVAILABLE:
        this.onPlayersAvailable.trigger(parsedMessage);
        break;
    }
    console.log('message', parsedMessage);
  };  
};

SocketController.prototype.createMessageObject = function (type, target, myPlayerName, move) {
  switch (type) {
    case constants.messageType.REQUESTNEWGAME:
      return {
        type: constants.messageType.REQUESTNEWGAME,
        game: {
          targetPlayer: target,
          initiatingPlayer: myPlayerName,
        },
      };
    case constants.messageType.GAMEMOVE:
      return {
        type: constants.messageType.GAMEMOVE,
        game: {
          player: {
            name: myPlayerName,
          },
          move,
        },
      };
  };
};

SocketController.prototype.sendMessage = function (message) {
  this.socket.send(JSON.stringify(message));
};

SocketController.prototype.startGame = function (targetPlayer, myPlayerName) {
  this.sendMessage(this.createMessageObject(constants.messageType.REQUESTNEWGAME, targetPlayer, myPlayerName));
};

SocketController.prototype.playMove = function (move) {
  this.sendMessage(this.createMessageObject(constants.messageType.GAMEMOVE, move));
};

module.exports = SocketController;
