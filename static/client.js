function update() 
{
	$.get('/messages', function(data) {
		if(data.list.length > 0) {
			for(i in data.list) {
				item = data.list[i];
				$("#messages").append(item.from+": "+item.msg+"<br/>");
			}
		}
	});

	setTimeout('update()', 1000);
}

$(document).ready(function() {
	update();
});
