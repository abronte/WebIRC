var app = require('express').createServer(),
		irc = require('./lib/IRC-js/lib/irc'),
		io = require('./lib/Socket.IO-node'),
		socket = io.listen(app);

require('jade');

var opts = {server: "irc.rizon.net",
						channel: "#Jerb",
					  nick: "Testington"};
//var ircMessages = new Array();
var webClient = null;
var server = new irc({ server: opts.server, nick: opts.nick });

server.connect(function(){
	server.join(opts.channel);
});

server.addListener('privmsg', function(msg) {
	console.log("IRC: "+msg.params[0]+" - "+msg.person.nick+":"+msg.params[1]+"\n");

	if(msg.params[0] == opts.channel) {
//		ircMessages.push({from:msg.person.nick,msg:msg.params[1],recv:false});
		if(webClient != null) {
			console.log("sending to the socket");
			webClient.send({from:msg.person.nick,msg:msg.params[1]});
		}
	}
});

socket.on('connection', function(client){
	console.log("got a client!");
	webClient = client;

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

app.get('/client.js', function(req, res){res.sendfile('static/client.js');});
app.get('/jquery.js', function(req, res){res.sendfile('static/jquery.js');});
app.get('/socket.io.js', function(req, res){res.sendfile('static/socket.io.js');});

app.listen(3000);