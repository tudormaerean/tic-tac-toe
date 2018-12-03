var CEvent = require('./CEvent');

function Connection(connection) {
  this.player = connection.player;
  this.connection = connection.connection;
  this.onMessageReceived = new CEvent();
  this.onConnectionClose = new CEvent();
  this.onConnectionError = new CEvent();
  this.startCloseListener();
  this.startErrorListener();
}

Connection.prototype.startMessageListener = function () {
  this.connection.on('message', (messageString) => this.onMessageReceived.trigger(JSON.parse(messageString).data));
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
  this.connection.on('error', (error) => this.connection.onConnectionError.trigger(error));
}

Connection.prototype.sendMessage = function (message) {
  this.connection.send(JSON.stringify(message));
};

module.exports = Connection;
