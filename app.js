var app = require('express').createServer();
var irc = require('./lib/IRC-js/lib/irc');
require('jade');

var opts = {server: "irc.rizon.net",
						channel: "#Jerb",
					  nick: "Testington"};

//var server = new irc({ server: 'irc.freenode.net', nick: 'Testington' });
var server = new irc({ server: opts.server, nick: opts.nick });

server.connect(function(){
	//server.nick("Testington");
	server.join(opts.channel);
});

var ircMessages = new Array();

server.addListener('privmsg', function(msg) {
	console.log("IRC: "+msg.params[0]+" - "+msg.person.nick+":"+msg.params[1]+"\n");

	if(msg.params[0] == opts.channel)
		ircMessages.push({from:msg.person.nick,msg:msg.params[1],recv:false});
});

app.set('view engine', 'jade');
app.set('view options', {
	    layout: false
});

app.get('/', function(req, res){
	//res.send('hello world');
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

app.listen(3000);