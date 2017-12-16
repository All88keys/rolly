/******************************************************************************
██████   ██████  ██    ██ ████████ ██ ███    ██  ██████
██   ██ ██    ██ ██    ██    ██    ██ ████   ██ ██
██████  ██    ██ ██    ██    ██    ██ ██ ██  ██ ██   ███
██   ██ ██    ██ ██    ██    ██    ██ ██  ██ ██ ██    ██
██   ██  ██████   ██████     ██    ██ ██   ████  ██████
******************************************************************************/
console.log('up and running!');
var express = require("express");
var app = express();
var http = require("http").Server(app);

http.listen(process.env.PORT || 5000);

/*app.get("/:code", function(req, res) {
  console.log(req.params)
  res.send(req.params);

  //res.send("client.ejs", {host: masdlms})
});*/

app.use(express.static("public"));

/******************************************************************************
 ██████  ████████ ██   ██ ███████ ██████      ██████  ███████ ██████  ███████
██    ██    ██    ██   ██ ██      ██   ██     ██   ██ ██      ██   ██ ██
██    ██    ██    ███████ █████   ██████      ██   ██ █████   ██████  ███████
██    ██    ██    ██   ██ ██      ██   ██     ██   ██ ██      ██           ██
 ██████     ██    ██   ██ ███████ ██   ██     ██████  ███████ ██      ███████
******************************************************************************/
//none atm

function rand(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

/******************************************************************************
███████  ██████   ██████ ██   ██ ███████ ████████ ██  ██████
██      ██    ██ ██      ██  ██  ██         ██    ██ ██    ██
███████ ██    ██ ██      █████   █████      ██    ██ ██    ██
     ██ ██    ██ ██      ██  ██  ██         ██    ██ ██    ██
███████  ██████   ██████ ██   ██ ███████    ██ ██ ██  ██████
******************************************************************************/
var io = require("socket.io")(http);
var sockets = [];
var players = [];

io.on("connection", function(socket) {
  console.log("a user has connected");
  sockets.push(socket);
  socket.socketId = sockets.length-1;

  // disconnect
  socket.on("disconnect", () => {
    sockets.splice(socket.socketId, 1);
    players.splice(socket.socketId, 1);
    for(var i = 0; i < sockets.length; i++) {
      sockets[i].socketId--;
    }
    console.log("a user has disconnected");
  });
  var colors = ['black', 'blue', 'red', 'green', 'pink', 'brown', 'yellow', 'purple'];
  socket.player = {
    name: "",
    color: colors[rand(0,colors.length-1)],
    x:250,
    y:250,
    xv:0,
    yv:0,
    update : function () {
      this.x+=this.xv;
      this.y+=this.yv;
    }
  }
  players.push(socket.player);

  socket.on('getName', function (name) {socket.player.name = name;});

  socket.on('deviceorientation', function (device) {
    socket.player.xv = device.gamma/10;
    socket.player.yv = device.beta/10;
  })
  setInterval(function () {
    socket.emit("update", players);
  },10)

});

setInterval(function () {
  for (var i = 0; i < players.length; i++) {
    players[i].update();
  }
},10);
