function update(msg) 
{
	$("#messages").append("&lt;"+msg.from+"&gt; "+msg.msg+"<br/>");
	
	scroll();
}

function updateAll(list)
{
	for(i in list) {
		$("#messages").append("&lt;"+list[i].from+"&gt; "+list[i].msg+"<br/>");
	}

	scroll();
}

function scroll() 
{
	$("#messages").scrollTop(500);
}

$(document).ready(function() {
	var socket = new io.Socket(null, {port: 3000});
	socket.connect();
	
	socket.on('message', function(msg) {
		if(msg.msgs != null) {
			updateAll(msg.msgs);
		} else {
			update(msg);
		}
	});
});
