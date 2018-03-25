const express = require('express');
const app = express();
// Run the app by serving the static files
// in the dist directory

app.use(express.static(__dirname + '/dist'));

// app.set('view engine', 'html');
// Start the app by listening on the default
// Heroku port
// app.listen(process.env.PORT || 3000);

const PORT  = process.env.PORT || 8080;

const CreateNewGame = function() {
  return {
    players: [],
    currentPlayer: '',
    grid: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    roomId: '',
    winner: ''
  };
};
const checkWinner = function(gameState) {
  let emptyFields = false;
  for (let index = 0, gameLength = gameState.length; index < gameLength; index++) {

    let initial = index < 3 ? index * 3 : index < 6 ? index - 3 : index === 7 ? 0 : 2,
        range = index < 3 ? 1 : index < 6 ? 3 : index === 7 ? 4 : 2,
        count = 0,
        empty = false;

    for (let i = 0; i < 3; i++) {
      let position = initial + (i * range);
      gameState[position] ? count += gameState[position] : empty = true;
    }
    if (empty) emptyFields = true;
    if (!empty && (count === 3) || (count === 6)) {
      return count / 3;
    }
  }
  return emptyFields ? 0 : -1;
};

const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connection', function(socket) {
    // PLAYER CLOSES THE BROWSER
    socket.on('disconnect', function() {
      console.log('someone disconnect: ' + socket.id);
      socket.to(socket.gameID).emit('opponent left', 'Your opponent left the game! YOU HAVE WON!');
    });

    // GAME FUNCTIONS
    socket.on('join-game', function(playerInfo) {
      let roomId = playerInfo.gameID,
          playerName = playerInfo.username,
          room;

      socket.join(roomId);
      room = io.sockets.adapter.rooms[roomId];
      if (room && room.game === undefined) room.game = new CreateNewGame();
      room.game.players.push(playerName);
      if (room.length === 2) {
        room.game.currentPlayer = room.game.players[0];
        room.game.roomId = roomId;
        io.in(roomId).emit('game-updated', room.game);
      }
    });

    socket.on('player-move', function (gameStatus) {
      let canMove = false;
      gameStatus.grid.forEach(function(position) {
        if (!position) canMove = true;
      });

      if (canMove && gameStatus.winner === '') {
        let winnerIndex = checkWinner(gameStatus.grid);

        if (!winnerIndex) {
          gameStatus.currentPlayer === gameStatus.players[0]
            ? gameStatus.currentPlayer = gameStatus.players[1]
            : gameStatus.currentPlayer = gameStatus.players[0];

          io.in(gameStatus.roomId).emit('game-updated', gameStatus);
        } else {
          gameStatus.winner = winnerIndex !== -1 ? gameStatus.players[winnerIndex] : '';
          gameStatus.currentPlayer = '';
          io.in(gameStatus.roomId).emit('game-updated', gameStatus);
          io.in(gameStatus.roomId).emit('game-over', gameStatus.winner);
        }
      }
    });

    socket.on('reset-game', function(gameInfo) {

      let playerName = gameInfo.username,
          gameStatus = gameInfo.gameStatus;

      if (gameStatus.players.length === 2) {
        gameStatus.players = [];
        gameStatus.currentPlayer = '';
        gameStatus.winner = '';
      }

      if (gameStatus.players.indexOf(playerName) === -1) {
        gameStatus.players.push(playerName);
        if (gameStatus.players.length === 2) {
          gameStatus.grid = [0, 0, 0, 0, 0, 0, 0, 0, 0];
          gameStatus.currentPlayer = gameStatus.players[0];
        }
        io.in(gameStatus.roomId).emit('game-updated', gameStatus);
      }
    });

    //CHAT FUNCTIONS
    socket.on('send-message', function(message) {
      console.log(message);
      socket.to(socket.gameID).emit('receive-message', message);
    });
});

app.get('*', function(req, res) {
  res.sendFile(__dirname + '/dist/index.html');
});

server.listen(PORT, function() {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
