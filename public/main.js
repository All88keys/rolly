var c = document.getElementById('canvas');
var ctx = c.getContext('2d');
var socket = io.connect();

window.addEventListener("deviceorientation", function (e) {
   socket.emit('deviceorientation', {alpha: e.alpha, beta: e.beta, gamma: e.gamma});
}, false);

socket.emit('getName', prompt('What is your name?'));

function getCode() {
  socket.emit("generateCode", (generatedCode) => {
    console.log(generatedCode);
    alert(generatedCode);
    socket.on("codeVerified", () => {
      console.log('host: ' + generatedCode);
    });
  });
}

function verifyCode() {
  let vcode = prompt("verify code:")
  socket.emit("verifyCode", vcode, (err) => {
    if(err) console.log(err);
    else console.log("client: " + vcode);
  });
}

socket.on('update', function (players) {
  ctx.clearRect(0,0,c.width,c.height)
  for (var i = 0; i < players.length; i++) {
    ctx.beginPath();
    ctx.fillStyle = players[i].color;
    ctx.fillRect(players[i].x,players[i].y,20, 20);
    ctx.closePath();
    ctx.fillText(players[i].name,players[i].x,players[i].y+30);
  }
})
