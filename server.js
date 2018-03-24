const express = require('express');
const app = express();
// Run the app by serving the static files
// in the dist directory

app.use(express.static(__dirname + '/dist'));

// app.set('view engine', 'html');
// Start the app by listening on the default
// Heroku port
// app.listen(process.env.PORT || 3000);

var nextTurn = function (playerOne, playerTwo, currentTurn) {
  console.log('the  turn is changing', currentTurn);
  var nextTurn = '';
  if (currentTurn === playerOne) {
    nextTurn = playerTwo;
  } else {
    nextTurn = playerOne;
  }
  console.log('the next turn is: ', nextTurn);
  return nextTurn;
}

function initializeGrid() {
  var blocks = [];
  for (let i = 0; i < 9; i++) blocks[i] = (null);
  return blocks;
}

function hasMoves(gameState) {
  for (let i = 0; i < 9; i++) {
    if(gameState[i] === null) {
      return true;
    }
  }
  return false;
}

function checkWinner(gameState) {
  if((gameState[0]) && gameState[0] === gameState[1] && gameState[1] === gameState[2] && gameState[0] && gameState[2])
    return gameState[0];

  if((gameState[3]) && gameState[3] === gameState[4] && gameState[4] === gameState[5] && gameState[3] && gameState[5])
    return gameState[3];

  if((gameState[6]) && gameState[6] === gameState[7] && gameState[7] === gameState[8] && gameState[6] && gameState[8])
    return gameState[6];

  if((gameState[0]) && gameState[0] === gameState[3] && gameState[3] === gameState[6] && gameState[0] && gameState[6])
    return gameState[0];

  if((gameState[1]) && gameState[1] === gameState[4] && gameState[4] === gameState[7] && gameState[1] && gameState[7])
    return gameState[1];

  if((gameState[2]) && gameState[2] === gameState[5] && gameState[5] === gameState[8] && gameState[2] && gameState[8])
    return gameState[2];

  if((gameState[0]) && gameState[0] === gameState[4] && gameState[4] === gameState[8] && gameState[0] && gameState[8])
    return gameState[0];

  if((gameState[2]) && gameState[2] === gameState[4] && gameState[4] === gameState[6] && gameState[2] && gameState[6])
    return gameState[2];

  else return 'noWinner';
}


var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', function(socket) {
    console.log('Someone connected via sockets');
    // PLAYER CLOSES THE BROWSER
    socket.on('disconnect', function() {
      console.log('someone disconnect: ' + socket.id);
      socket.to(socket.gameID).emit('opponent left', 'Your opponent left the game! YOU HAVE WON!');
    });

    // GAME FUNCTIONS
    socket.on('join game', function(playerInfo) {
      console.log(playerInfo);
      socket.name = playerInfo.username;
      socket.gameID = playerInfo.gameID;
      socket.join(socket.gameID);
      var room = io.sockets.adapter.rooms[socket.gameID];
      console.log('el numero de jugadores' + room.length);
      if (room.length >= 2) {
        var playerSockets = [];
        var socketsObject = room.sockets;
        for (let id of Object.keys(socketsObject)) {
          playerSockets.push(io.sockets.connected[id]);
        }

        var gameStatus = {
         playerOne: playerSockets[0].name,
         playerTwo: playerSockets[1].name,
         currentPlayer: playerSockets[0].name,
         gameStarts: true,
         winner: 'noWinner',
         draw: false,
         grid: initializeGrid()
        }

        console.log(gameStatus);
        io.in(socket.gameID).emit('game starts', gameStatus);
      } else {
        console.log('no hay 2 players!');
        io.in(socket.gameID).emit('opponent not found', true);
      }
});

    socket.on('player move', function (blockId, gameStatus) {
      var winner = checkWinner(gameStatus.grid);
      var emptyBlocks = hasMoves(gameStatus.grid);

      if (winner === 'noWinner' && emptyBlocks) {
        gameStatus.currentPlayer = nextTurn(gameStatus.playerOne, gameStatus.playerTwo, gameStatus.currentPlayer);
        console.log(gameStatus);
        socket.to(socket.gameID).emit('opponent move', gameStatus);

      } else if (winner === 'noWinner' && !emptyBlocks) {
        gameStatus.draw = true;
        console.log(gameStatus);
        io.in(socket.gameID).emit('opponent move', gameStatus);

      } else {
        gameStatus.winner = winner;
        console.log('the winner of the game is: ', winner);
        io.in(socket.gameID).emit('opponent move', gameStatus);
      }
    });

    //CHAT FUNCTIONS
    socket.on('send-message', function(message) {
      console.log(message);
      // socket.to(socket.gameID).emit('receive-message', message);
      socket.broadcast.emit('receive-message', message);
    });
});

app.get('*', function(req, res) {
  res.sendFile(__dirname + '/dist/index.html');
});

server.listen(8080, function() {
    console.log("Servidor corriendo en http://localhost:8080");
});
