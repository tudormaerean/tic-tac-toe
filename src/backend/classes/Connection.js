var CEvent = require('./CEvent');
var constants = require('../utils/constants');

function Connection(connection) {
  this.player = connection.player;
  this.connection = connection.connection;
  this.onMessageReceived = new CEvent();
  this.onConnectionClose = new CEvent();
  this.onConnectionError = new CEvent();
  this.onNewGameRequested = new CEvent();
  this.startMessageListener();
  this.startCloseListener();
  this.startErrorListener();
}

Connection.prototype.startMessageListener = function () {
  console.log('Started listening to:', this.player.name);
  this.connection.on('message', (message) => {
    if (message.type === 'utf8') {
      var parsedMessage = JSON.parse(message.utf8Data);
      console.log(`${this.player.name} has said:`, parsedMessage);
      switch (parsedMessage.type) {
        case constants.REQUESTNEWGAME:
          this.onNewGameRequested.trigger(parsedMessage);
          break;
      }
      this.onMessageReceived.trigger(parsedMessage);
    }
  });
};

Connection.prototype.startCloseListener = function () {
  this.connection.on('close', () => {
    this.onConnectionClose.trigger({
      player: this.player,
      connection: this.connection,
    });
  });
};

Connection.prototype.startErrorListener = function () {
  this.connection.on('error', (error) => this.onConnectionError.trigger(error));
}

Connection.prototype.sendMessage = function (message) {
  // console.log('BE message', message);
  this.connection.send(JSON.stringify(message));
};

module.exports = Connection;
