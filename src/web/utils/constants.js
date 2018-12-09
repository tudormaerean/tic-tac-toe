module.exports = {
  messageType: {
    GENERAL: 'general',
    STARTGAME: 'start-game',
    REQUESTNEWGAME: 'request-new-game',
    GAMESTARTED: 'game-started',
    GAMEUPDATED: 'game-updated',
    GAMECOMPLETED: 'game-completed',
    GAMECOMPLETEDDRAW: 'game-completed-draw',
    GENERALJOIN: 'general-join',
    GENERALLEAVE: 'general-leave',
    PLAYERSAVAILABLE: 'players-available',
    JOINACK: 'join-ack',
    GAMEMOVE: 'game-move',
  },
  cellType: {
    X: 'X',
    O: 'O',
    FREE: '',
  }
};
