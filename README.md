# tic-tac-toe

### How to start

Run the following:
```
npm install
npm start
```

Open a browser and as many tabs as desired to:
```
localhost:3000
```

### How to play

Pick a board size (the matrix side size) then choose an available opponent from the lobby and click `Start game`.

The server will announce each player's move and when the winning/draw condition is being met.

After a game has ended, the participating player will once again be able to start a new game with other available players.

### Future issues to resolve

- Add a singleton state object for the Node backend, if the class structure deepens.
- Add a spectator key to the backend game object in the Game class which would hold the connections of players watching a game.
- Add a special AI player, always present in the Lobby.
- Develop the unit tests throughout the project.
