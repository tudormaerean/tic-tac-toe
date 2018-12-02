var SocketController = require('./SocketController');

function Main () {
  this.socketController;
}

Main.prototype.init = function (server) {
  this.socketController = new SocketController();

  this.socketController.init(server);
  this.socketController.onNewConnection.addEventListener(() => console.log('New connection'));
  this.socketController.onRemoveConnection.addEventListener(() => console.log('Removed connection'));
};

module.exports = Main;
