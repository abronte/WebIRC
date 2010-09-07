var channelList = [];

function update(msg) 
{
	for(i in channelList) {
		if(channelList[i] == msg.channel)
			$("#messages"+i).append("&lt;"+msg.from+"&gt; "+msg.msg+"<br/>");
	}
	
	scroll(i);
}

function updateAll(list)
{
	for(i in list) {
		for(j in channelList) {
			if(channelList[j] == list[i].channel)
				$("#messages"+j).append("&lt;"+list[i].from+"&gt; "+list[i].msg+"<br/>");
		}
	}

	for(i in channelList)
		scroll(i);
}

function scroll(i) 
{
	$("#messages"+i).scrollTop(20000);
}

function createChannels(list) 
{
	str = '<div id="tabs"><ul>';

	for(i in list) {
		str += '<li><a href="#tabs-'+i+'">'+list[i]+'</a></li>';
	}

	str += '</ul>';

	for(i in list) {
		str += '<div id="tabs-'+i+'"><div id="messages'+i+'" class="messages"></div></div>';
	}

	str += '</div>';

	$('body').append(str);

	$('#tabs').tabs({selected: 0});
}

$(document).ready(function() {
	var socket = new io.Socket(null, {port: 3000});
	socket.connect();
	
	socket.on('message', function(msg) {
		if(msg.channels != null) {
			channelList = msg.channels;				
			createChannels(msg.channels);
			updateAll(msg.msgs);
		} else {
			update(msg);
		}
	});
});
