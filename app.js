var express = require('express')
var app = express.createServer(),
		irc = require('IRC-js'),
		io = require('Socket.IO').listen(app);

require('jade');

var opts = {server: "irc.quakenet.org",
						channels: ["#teamliquid", "#tlpickup"],
					  nick: "SimonR",
						maxMsgs: 1000};
var ircMessages = [];
var webClients = []; 
var server = new irc({ server: opts.server, nick: opts.nick });

server.connect(function() {
	setTimeout(function() {
		for(i in opts.channels) {
			server.join(opts.channels[i]);
		}
	}, 2000);
});

server.addListener('privmsg', function(msg) {
	nick = msg.person.nick;
	chan = msg.params[0];
	message = msg.params[1];

	var data = {channel: chan, from:nick, msg:message};

	console.log("IRC: "+msg.params[0]+" - "+msg.person.nick+":"+msg.params[1]+"\n");

	for(i in opts.channels) {
		if(chan == opts.channels[i]) {
			ircMessages.push(data);

			if(webClients.length != 0) {
				for(i in webClients) {
						webClients[i].client.json.send(data);
				}
			}
		}
	}

	if(ircMessages.length >= opts.maxMsgs) 
		ircMessages = ircMessages.splice(0,1);
});

io.sockets.on('connection', function(client) {
	webClients.push({session:client.sessionId,client:client});
	console.log("got a client :: "+client.sessionId+" :: "+webClients.length);

	client.json.send({msgs:ircMessages,channels: opts.channels});

	client.on('disconnect', function(){ 
		for(i in webClients) {
			if(webClients[i].session == client.sessionId)
				webClients.splice(i,1);
		}
		console.log("disconnect");
	});
});

app.set('view engine', 'jade');
app.set('view options', {
	    layout: false
});

app.get('/', function(req, res){
	res.render('index');	
});

app.get('/*.*', function(req, res){res.sendfile("./static"+req.url);});

app.listen(3000);
