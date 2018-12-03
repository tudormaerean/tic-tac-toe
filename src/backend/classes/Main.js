var SocketController = require('./SocketController');

function Main () {
  this.socketController;
}

Main.prototype.init = function (server) {
  this.socketController = new SocketController();

  this.socketController.init(server);
  this.socketController.onNewConnection.addEventListener(() => null);
  this.socketController.onRemoveConnection.addEventListener(() => null);
};

module.exports = Main;
