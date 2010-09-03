var app = require('express').createServer();
var irc = require('./IRC-js/lib/irc');

var server = new irc({ server: 'irc.freenode.net', nick: 'Testington' });

server.connect(function(){
	server.nick("Testington");
	server.join("#Jerb");
});

server.addListener('privmsg', function(msg) {
	//this.send('PRIVMSG', channel, text);
	console.log("IRC: "+msg.params[1]+"\n");
});

//server.join("jerb");

app.get('/', function(req, res){
	    res.send('hello world');
});

app.listen(3000);