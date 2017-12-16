// generate and return code
socket.on("generateCode", fn => {
  for(var i = 0, code = ""; i < 5; i++) {
    code += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
  }
  // TODO: make sure codes are unique
  // TODO: make sure user is not already assigned a code, or disconnect them and all connected codes
  socket.code = code;
  socket.host = true;
  fn(code);
});

// verify code
socket.on("verifyCode", (code, fn) => {

  //console.log(Object.keys(sockets));
  //sockets.filter(s => console.log(s.code, code, s.code === code && s.host));

  // only match sockets that are hosts and that have a matching code
  var matchingCodeHosts = sockets.filter(s => s.code === code && s.host);
  // if code nonexistant return error
  if(matchingCodeHosts.length === 0) {
    return fn("code doesn't exist");
  }

  // if something is already connected return error
  if(sockets.filter(s => s.code === code && !s.host).length > 0) {
    return fn("host already matched");
  }
  // if host is self return error
  if(matchingCodeHosts[0].id === socket.id) {
    return fn("host cannot be client");
  }
  // success! set code, host, and socketPair (for both)
  var host = matchingCodeHosts[0];
  socket.code = code;
  socket.host = false;
  socket.socketPair = host;
  // TODO: delete carInfo on socket exit
  host.player = {x:0,y:0}
  host.emit("codeVerified");
  fn();
});

// device orientation update
socket.on("deviceorientation", function(turn, pedal) {
  if(socket.host === false && (socket.socketPair && socket.socketPair.code === socket.code)) {
    socket.socketPair.player.x = turn;
    socket.socketPair.player.y = pedal;
  }
});
