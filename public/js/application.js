$(document).ready(function(){
	$("#game .peca").draggable({
	   revert: 'invalid'
	});
	
	$("#game td").droppable({
	    accept: function(elementos) {
			console.log(elementos, this);
	        return true;
	    },
		drop: function(event, ui) {
			console.log(event, ui, ui.draggable);
			$(this).append(ui.draggable.css('top','0').css('left', '0'));
		}
	});
});