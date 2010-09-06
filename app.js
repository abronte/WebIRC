var app = require('express').createServer(),
		irc = require('./lib/IRC-js/lib/irc'),
		io = require('./lib/Socket.IO-node'),
		socket = io.listen(app);

var nstatic = require('./lib/node-static/lib/node-static');
var fileServer = new nstatic.Server('./static');

require('jade');

var opts = {server: "irc.quakenet.org",
						channel: "#jerb",
					  nick: "SimonR",
						maxMsgs: 500};
var ircMessages = [];
var webClients = []; 
var server = new irc({ server: opts.server, nick: opts.nick });

server.connect(function() {
	setTimeout(function() {
		server.join(opts.channel);
	}, 2000);
});

server.addListener('privmsg', function(msg) {
	nick = msg.person.nick;
	chan = msg.params[0];
	message = msg.params[1];

	var data = {channel: chan, from:nick, msg:message};

	console.log("IRC: "+msg.params[0]+" - "+msg.person.nick+":"+msg.params[1]+"\n");

	if(chan == opts.channel) {
		ircMessages.push(data);

		if(webClients.length != 0) {
			for(i in webClients) {
					webClients[i].client.send(data);
			}
		}

		if(ircMessages.length >= opts.maxMsgs) 
			ircMessages = ircMessages.slice(500);
	}
});

socket.on('connection', function(client){
	webClients.push({session:client.sessionId,client:client});
	console.log("got a client :: "+client.sessionId+" :: "+webClients.length);

	client.send({msgs:ircMessages});

	client.on('disconnect', function(){ 
		for(i in webClients) {
			if(webClients[i].session == client.sessionId)
				webClients.splice(i,1);
		}
		console.log("disconnect");
	});
});

app.use(function(req, res, next){
	fileServer.serve(req, res);
});

app.set('view engine', 'jade');
app.set('view options', {
	    layout: false
});

app.get('/', function(req, res){
	res.render('index');	
});

app.listen(3000);