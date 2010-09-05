var app = require('express').createServer(),
		irc = require('./lib/IRC-js/lib/irc'),
		io = require('./lib/Socket.IO-node'),
		socket = io.listen(app);

require('jade');

var opts = {server: "irc.rizon.net",
						channel: "#Jerb",
					  nick: "Testington",
						maxMsgs: 500};
var ircMessages = new Array();
var webClient = null;
var server = new irc({ server: opts.server, nick: opts.nick });

server.connect(function(){
	server.join(opts.channel);
});

server.addListener('privmsg', function(msg) {
	nick = msg.person.nick;
	chan = msg.params[0];
	message = msg.params[1];

	var data = {from:nick, msg:message};

	console.log("IRC: "+msg.params[0]+" - "+msg.person.nick+":"+msg.params[1]+"\n");

	if(chan == opts.channel) {
		ircMessages.push(data);

		if(webClient != null) 
			webClient.send(data);

		if(ircMessages.length >= opts.maxMsgs)
			ircMessages = ircMessages.slice(500);
	}
});

socket.on('connection', function(client){
	console.log("got a client!");
	webClient = client;

	client.send({msgs:ircMessages});

	client.on('disconnect', function(){ 
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

app.get('/messages', function(req, res){
	var newMsgs = new Array();

	for(i in ircMessages) {
		if(!ircMessages[i].recv) {
			msg = ircMessages[i];
			ircMessages[i].recv = true;
			newMsgs.push({from:msg.from,msg:msg.msg});
		}
	}
	res.send({list: newMsgs});
});

app.get('/style.css', function(req, res){res.sendfile('static/style.css');});
app.get('/client.js', function(req, res){res.sendfile('static/client.js');});
app.get('/jquery.js', function(req, res){res.sendfile('static/jquery.js');});
app.get('/socket.io.js', function(req, res){res.sendfile('static/socket.io.js');});

app.listen(3000);