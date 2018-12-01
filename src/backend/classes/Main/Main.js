var SocketController = require('../SocketController/SocketController');

function Main() {
  this.socketController;
}

Main.prototype.init = function(server) {
  this.socketController = new SocketController();

  this.socketController.init(server);
  this.socketController.startConnectionListener();
  // this.socketController.startCloseListener(() => this.removeConnections());
}

module.exports = Main;
