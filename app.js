var app = require('express').createServer();
var irc = require('./lib/IRC-js/lib/irc');
require('jade');

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

app.set('view engine', 'jade');
app.set('view options', {
	    layout: false
});

app.get('/', function(req, res){
	//res.send('hello world');
	res.render('index');	
});

app.listen(3000);