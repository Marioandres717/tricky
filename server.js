const express = require('express');
const app = express();
// Run the app by serving the static files
// in the dist directory

app.use(express.static(__dirname + '/dist'));

// app.set('view engine', 'html');
// Start the app by listening on the default
// Heroku port
// app.listen(process.env.PORT || 3000);


/// SOCKET.IO Functionality
//store users(sockets) connected to the server
var waitingQueue = [];
//Room number
var gameNumber = 1;


var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', function(socket) {
    console.log('Someone connected via sockets');
    // PLAYER CLOSES THE BROWSER
    socket.on('disconnect', function() {
      console.log('someone disconnect: ' + socket.id);
      var index = waitingQueue.indexOf(socket);
      if (index !== -1) {
        waitingQueue.splice(index, 1);
      }
      socket.to(socket.gameID).emit('opponent left', 'Your opponent left the game! YOU HAVE WON!');
    });

    // GAME FUNCTIONS
    socket.on('join game', function(playerInfo) {
      console.log(socket.id);
      socket.name = 'usernames';
      socket.gameID = null;
      waitingQueue.push(socket);
      socket.emit('new-message', 'Hello from the server');
    });

    socket.on('player move', function (blockId) {
      console.log('block selected: ' + blockId);
      socket.to(socket.gameID).emit('opponent move', blockId);
    });


    //CHAT FUNCTIONS
    socket.on('send-message', function(message) {
      console.log(message);
      socket.to(socket.gameID).emit('receive-message', message);
    });
});



// FUNCTION FOR CREATING 2 PEOPLE SESSIONS
setInterval(function(){
  console.log('The number of Players in the queue are: ' + waitingQueue.length);
  // if there is only one person in the queue then return
  if(waitingQueue.length < 2)
    return;

  //else, there is more than 1 person in the queue
  //Select randomly the players & dequeue them
  //Player 1
  var indexOfPlayer = Math.floor(Math.random()*waitingQueue.length);
  var playerOne = waitingQueue[indexOfPlayer];
  waitingQueue.splice(indexOfPlayer, 1);

  //Player 2
  var indexOfPlayer = Math.floor(Math.random()*waitingQueue.length);
  var playerTwo = waitingQueue[indexOfPlayer];
  //Remove player from queue
  waitingQueue.splice(indexOfPlayer, 1);
  //Create game id
  var gameID = 'gameID' + gameNumber++;
  //Create room for the 2 players (join is a method from socket.io)
  playerOne.join(gameID);
  playerTwo.join(gameID);
  //set gameID property in socket
  playerOne.gameID = gameID;
  playerTwo.gameID = gameID;
  //TEST MESSAGE
  console.log(waitingQueue.length);
  io.to(gameID).emit('welcome room', {msg: `hi from room ${gameID}`});

},2000);

app.get('*', function(req, res) {
  res.sendFile(__dirname + '/dist/index.html');
});

server.listen(8080, function() {
    console.log("Servidor corriendo en http://localhost:8080");
});
