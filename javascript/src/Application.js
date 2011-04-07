var tabuleiro;

$(document).ready(function(){

	var movimentos = new Resta1.Movimentos({json : '/movimentos'});
	tabuleiro  = new Resta1.Tabuleiro({
		id : 'tabuleiro', 
		movimentos : movimentos,
		contador : 'pontuacao'
	});
	
	$('#pontuacao').bind('totalDePecasAlterado', function(event, novoValor) {
		$(this).text(novoValor);
	});
	
});
