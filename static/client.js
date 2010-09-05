function update(msg) 
{
	$("#messages").append(msg.from+": "+msg.msg+"<br/>");
}

$(document).ready(function() {
	var socket = new io.Socket(null, {port: 3000});
	socket.connect();

	socket.on('message', function(msg) {
		update(msg);
	});
});
