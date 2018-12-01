function Connection(connection) {
  this.id = connection.id;
  this.connection = connection.connection;
}

Connection.prototype.startMessageListener = function () {
  this.connection.on('message', () => {});
};

Connection.prototype.startCloseListener = function (removeConnection) {
  var self = this;
  this.connection.on('close', () => {
    removeConnection({
      id: self.id,
      connection: self.connection,
    });
  });
};

Connection.prototype.sendMessage = function (message) {
  this.connection.send(JSON.stringify(message));
};

module.exports = Connection;
