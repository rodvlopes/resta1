function Movimentos() {
	this.movimentos = [['01','02','03'],['03','02','01'],['02','03','04'],['04','03','02'],['03','04','05'],['04','05','06'],['05','04','03'],['05','06','07'],['06','05','04'],['07','06','05']];

	this.ehValido = function(de, para) {
		for (var i in this.movimentos) {
			var m = this.movimentos[i];
			if (m[0]==de && m[2]==para) { return m; }
		}
		return false;
	}
}

$(document).ready(function(){
	var movimentos = new Movimentos();
	
	$("#game .peca").draggable({
	   revert: 'invalid'
	});
	
	$("#game td").droppable({
	    accept: function(elemento) {
			var para_spot = this.getAttribute('data-spot');
			var de_spot   = elemento.parent().get(0).getAttribute('data-spot');
			//verificar se o movimento é possível para o tabuleiro atual
			if (movimento = movimentos.ehValido(de_spot, para_spot)) {
				var meio_spot = movimento[1]
				if ( $('#game td[data-spot="'+meio_spot+'"]').children().length >  0 &&
					 $('#game td[data-spot="'+para_spot+'"]').children().length == 0 
					) {
						return true
					}
			}
	        return false;
	    },
		activate: function(event, ui) {
			var para_spot = this.getAttribute('data-spot');
			var de_spot   = ui.draggable.parent().get(0).getAttribute('data-spot');
			if (movimentos.ehValido(de_spot, para_spot)) {
				$('#game td[data-spot="'+para_spot+'"]').addClass('highlight');
			}
			
		},
		deactivate: function() {
			$('#game td').removeClass('highlight');
		},
		drop: function(event, ui) {
			var para_spot = this.getAttribute('data-spot');
			var de_spot   = ui.draggable.parent().get(0).getAttribute('data-spot');
			movimento = movimentos.ehValido(de_spot, para_spot)
			var meio_spot = movimento[1]
			
			$('#game td[data-spot="'+meio_spot+'"]').children().fadeOut(function(){$(this).remove()});
			
			$(this).append(ui.draggable.css('top','0').css('left', '0'));
			$('#game td').removeClass('highlight');
		}
	});
});