const express = require('express');
const app = express();
// Run the app by serving the static files
// in the dist directory

// app.use(express.static(__dirname + '/dist'));
app.use(express.static(__dirname + '/dist'));

// app.set('view engine', 'html');
// Start the app by listening on the default
// Heroku port
// app.listen(process.env.PORT || 3000);

var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', function() {
    console.log('Alguien se ha conectado con sockets');
});

server.listen(8080, function() {
    console.log("Servidor corriendo en http://localhost:8080");
});
