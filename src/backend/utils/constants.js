module.exports = {
  messageType: {
    STARTGAME: 'start-game',
    REQUESTNEWGAME: 'request-new-game',
    GAMESTARTED: 'game-started',
    GAMEUPDATED: 'game-updated',
    GENERALJOIN: 'general-join',
    GENERALLEAVE: 'general-leave',
    JOINACK: 'join-ack',
    MOVE: 'move',
  },
  cellType: {
    X: 'X',
    O: 'O',
    FREE: '',
  }
};
