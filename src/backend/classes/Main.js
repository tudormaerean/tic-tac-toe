var SocketController = require('./SocketController');
var Game = require('./Game');

function Main () {
  this.socketController;
  this.gamesArray = [];
}

Main.prototype.init = function (server) {
  this.socketController = new SocketController();

  this.socketController.init(server);
  this.socketController.onNewConnection.addEventListener(() => null);
  this.socketController.onRemoveConnection.addEventListener(() => null);
  this.socketController.onNewGameRequested.addEventListener((newGameObj) => this.startNewGame(newGameObj));
  this.socketController.onGameUpdate.addEventListener((gameUpdate) => this.updateGame(gameUpdate));
};

Main.prototype.startNewGame = function (newGameObj) {
  var gameConnections = [];
  this.socketController.connectionsArray.map((connection) => {
    if (connection.player.name === newGameObj.game.targetPlayer || connection.player.name === newGameObj.game.initiatingPlayer) {
      gameConnections.push(connection);
      connection.player.available = false;
    }
    return connection;
  });
  var gameObj = {
    game: newGameObj.game,
    gameConnections,
  };
  var newGame = new Game();
  newGame.init(gameObj, this.socketController);
  this.gamesArray.push(newGame);
  newGame.onGameEnded.addEventListener(() => this.closeGame(newGame));
};

Main.prototype.updateGame = function (gameUpdate) {
  const gameToUpdate = this.gamesArray.find(game => game.playerOne.name === gameUpdate.game.player.name || game.playerTwo.name === gameUpdate.game.player.name);
  gameToUpdate.updateGameBoard(gameUpdate);
};

Main.prototype.closeGame = function (game) {
  this.gamesArray.splice(this.gamesArray.indexOf(game), 1);
};

module.exports = Main;
