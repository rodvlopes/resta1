$(document).ready(function(){
	var movimentos = new Resta1.Movimentos();
	
	$.getJSON('/movimentos', function(lista_movimentos){
		movimentos.movimentos = lista_movimentos;
	})
	
	$("#tabuleiro .peca").draggable({
	   revert: 'invalid'
	});
	
	$("#tabuleiro td").droppable({
		accept: function(elemento) {
			var para_spot = this.getAttribute('data-spot');
			var de_spot   = elemento.parent().get(0).getAttribute('data-spot');
			var movimento = movimentos.ehValido(de_spot, para_spot)
			if (!movimento) return false;
			return ehUmMovimentoPossivelNoTabuleiro(movimento);
    },
		activate: function(event, ui) {
			var para_spot = this.getAttribute('data-spot');
			var de_spot   = ui.draggable.parent().get(0).getAttribute('data-spot');
			if (movimentos.ehValido(de_spot, para_spot)) {
				$('#tabuleiro td[data-spot="'+para_spot+'"]').addClass('highlight');
			}			
		},
		deactivate: function() {
			$('#tabuleiro td').removeClass('highlight');
		},
		drop: function(event, ui) {
			var para_spot = this.getAttribute('data-spot');
			var de_spot   = ui.draggable.parent().get(0).getAttribute('data-spot');
			movimento = movimentos.ehValido(de_spot, para_spot)
			var meio_spot = movimento[1]
			
			$('#tabuleiro td[data-spot="'+meio_spot+'"]').children().fadeOut(function(){$(this).remove()});
			
			$(this).append(ui.draggable.css('top','0').css('left', '0'));
			$('#tabuleiro td').removeClass('highlight');
		}
	});
});

function ehUmMovimentoPossivelNoTabuleiro(movimento) {
	var meio_spot = movimento[1];
	var para_spot = movimento[2];
	return 	$('#tabuleiro td[data-spot="'+meio_spot+'"]').children().length >  0 &&
					$('#tabuleiro td[data-spot="'+para_spot+'"]').children().length == 0;
}